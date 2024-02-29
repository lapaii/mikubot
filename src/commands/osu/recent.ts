import { calculatePP } from "../../utils/ppCalculator";
import { generateModString, generateGradeString, rgbInt } from "../../utils/stuff";
import { ApplicationCommandOptionType } from "lilybird";
import { v2 } from "osu-api-extended";
import type { ApplicationCommandData, Interaction } from "lilybird";
import type { SlashCommand } from "@lilybird/handlers";

export default {
    post: "GLOBAL",
    data: {
        name: "rs",
        description: "view recent play",
        options: [
            {
                type: ApplicationCommandOptionType.STRING,
                name: "username",
                description: "specify osu! username",
                required: true
            }
        ]
    },
    run
} satisfies SlashCommand;

async function run(interaction: Interaction<ApplicationCommandData>): Promise<void> {
    const startTime = performance.now();

    if (!interaction.isApplicationCommandInteraction() || !interaction.inGuild()) return;

    await interaction.deferReply();
    // would test if user has linked account with db but not done yet
    const username = interaction.data.getString("username") ?? interaction.member.user.username;
    const details = await v2.user.details(username);
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

    await interaction.editReply({
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
