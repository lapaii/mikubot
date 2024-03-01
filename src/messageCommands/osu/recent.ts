import { calculatePP } from "../../utils/ppCalculator";
import { generateGradeString, generateModString, rgbInt } from "../../utils/stuff";
import { getOsuIdFromDiscord } from "../../utils/database";
import { v2 } from "osu-api-extended";
import type { Message } from "lilybird";
import type { MessageCommand } from "../../types/commands";

export default {
    name: "recent",
    description: "view recent play",
    aliases: ["rs"],
    cooldown: 1000,
    run
} satisfies MessageCommand;

async function run({ message, args }: { message: Message, args: Array<string> }): Promise<void> {
    const startTime = performance.now();
    // would test if user has linked account with db but not done yet
    const { 0: username } = args;
    let userIdFromDb = 0;

    if (!username) {
        userIdFromDb = getOsuIdFromDiscord(message.author.id);
        if (userIdFromDb === -1) {
            await message.reply("no account linked! use the ;link [username] command to link an osu! account");
            return;
        }
    }

    const userToSearch = username ? username : userIdFromDb;

    console.log(userToSearch);

    const details = await v2.user.details(userToSearch);
    const recentScore = await v2.scores.user.category(details.id, "recent", { include_fails: true });

    const { 0: mostRecentScore } = recentScore;

    const num300s = mostRecentScore.statistics.great ? mostRecentScore.statistics.great : 0;
    const num100s = mostRecentScore.statistics.ok ? mostRecentScore.statistics.ok : 0;
    const num50s = mostRecentScore.statistics.meh ? mostRecentScore.statistics.meh : 0;
    const numMiss = mostRecentScore.statistics.miss ? mostRecentScore.statistics.miss : 0;

    const legacyComboIncrease = mostRecentScore.maximum_statistics.legacy_combo_increase ? mostRecentScore.maximum_statistics.legacy_combo_increase : 0;
    const perfectCombo = mostRecentScore.maximum_statistics.great + legacyComboIncrease;

    const ppCalc = await calculatePP({ id: mostRecentScore.beatmap_id, mods: mostRecentScore.mods_id, num300s, num100s, num50s, numMiss, combo: mostRecentScore.max_combo, maxCombo: perfectCombo });

    let ppText = "";
    if ("effectiveMissCount" in ppCalc.current) {
        const { pp, effectiveMissCount } = ppCalc.current;
        if (effectiveMissCount > 0 && ppCalc.ifFc) {
            const { pp: ifFcPp } = ppCalc.ifFc;
            ppText = `${pp.toFixed(2)} (${ifFcPp.toFixed(2)} if fc)`;
        } else ppText = `${pp.toFixed(2)}`;
    } else {
        const { pp } = ppCalc.current;
        ppText = `${pp.toFixed(2)}`;
    }

    const modString = generateModString(mostRecentScore.mods);

    const passedObjects = num300s + num100s + num50s + numMiss;
    const maxObjects = mostRecentScore.beatmap.count_circles + mostRecentScore.beatmap.count_sliders + mostRecentScore.beatmap.count_spinners;
    const gradeString = generateGradeString(passedObjects, maxObjects, mostRecentScore.rank);

    await message.reply({
        embeds: [
            {
                author: { name: `${details.username} (#${details.rank_history.data[89].toLocaleString()})`, url: `https://osu.ppy.sh/u/${details.id}` },
                title: `${mostRecentScore.beatmapset.title} [${mostRecentScore.beatmap.version}] +${modString} [${ppCalc.current.difficulty.stars.toFixed(2)}*]`,
                url: `${mostRecentScore.beatmap.url}`,
                fields: [
                    { name: "grade", value: gradeString, inline: true },
                    { name: "score", value: `${mostRecentScore.total_score.toLocaleString()}`, inline: true },
                    { name: "combo", value: `${mostRecentScore.max_combo.toLocaleString()} / ${perfectCombo.toLocaleString()}`, inline: true },
                    { name: "pp", value: ppText, inline: true },
                    { name: "accuracy", value: `${(mostRecentScore.accuracy * 100).toFixed(2)}%`, inline: true },
                    { name: "hits", value: `${num300s.toLocaleString()} / ${num100s.toLocaleString()} / ${num50s.toLocaleString()} / ${numMiss.toLocaleString()}`, inline: true }
                ],
                image: { url: `${mostRecentScore.beatmapset.covers["card@2x"]}` },
                color: rgbInt(22, 145, 217),
                timestamp: mostRecentScore.ended_at
            }
        ]
    });

    const endTime = performance.now();
    console.log(`took ${(endTime - startTime) / 1000} seconds`);
}
