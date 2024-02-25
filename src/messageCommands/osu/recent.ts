import { parseArgs } from "node:util";
import { Message } from "lilybird";
import { MessageCommand } from "src/types/commands.js";
import { tools, v2 } from 'osu-api-extended';
import { name, id } from "osu-api-extended/dist/utility/mods.js";
import { calculatePP } from "src/utils/ppCalculator.js";
import { request } from "src/utils/request.js";
import { rgbInt } from "src/utils/stuff.js";

// THIS IS A MESSSSSSSSSSSS
// TODO: NEEDS REWRITE !!! IT LOOKS SO UGLYYYYYYYYYY

export default {
	name: 'recent',
	description: 'view recent play',
	aliases: ['rs'],
	cooldown: 1000,
	run
} satisfies MessageCommand;

async function run({ message, args }: { message: Message, args: Array<string> }): Promise<void> {
	// would test if user has linked account with db but not done yet
	const { 0: username } = args;
	const details = await v2.user.details(username);
	const recentScore = await v2.scores.user.category(details['id'], "recent", { include_fails: false });

	console.log(recentScore[0])

	if (recentScore[0] == undefined) {
		await message.reply({
			embeds: [
				{
					title: `${username} has no recent plays`
				}
			]
		});
		return;
	}

	const num300s = recentScore[0]['statistics']['great'] ? recentScore[0]['statistics']['great'] : 0;
	const num100s = recentScore[0]['statistics']['ok'] ? recentScore[0]['statistics']['ok'] : 0;
	const num50s = recentScore[0]['statistics']['meh'] ? recentScore[0]['statistics']['meh'] : 0;
	const numMiss = recentScore[0]['statistics']['miss'] ? recentScore[0]['statistics']['miss'] : 0;

	const legacy_combo_increase = recentScore[0]['maximum_statistics']['legacy_combo_increase'] ? recentScore[0]['maximum_statistics']['legacy_combo_increase'] : 0;
	const perfectCombo = recentScore[0]['maximum_statistics']['great'] + legacy_combo_increase;

	const pp = await calculatePP({ id: recentScore[0]['beatmap_id'], mods: recentScore[0]['mods_id'], num300s, num100s, num50s, numMiss, combo: recentScore[0]['max_combo'] });

	const ifFcNum300s = num300s + numMiss;
	console.log(`if fc: ${ifFcNum300s} / ${num100s} / ${num50s} / 0`);
	const ifFcAcc = tools.accuracy({
		"300": String(ifFcNum300s),
		"100": String(num100s),
		"50": String(num50s),
		"0": "0",
		geki: "0",
		katu: "0"
	}, 'osu');
	console.log(ifFcAcc.toFixed(2));

	const ppCalc = await tools.pp.calculate(
		recentScore[0]['beatmap_id'],
		recentScore[0]['mods_id'],
		recentScore[0]['max_combo'],
		numMiss,
		parseFloat((recentScore[0]['accuracy'] * 100).toFixed(2))
	);

	const ppIfFc = await tools.pp.calculate(
		recentScore[0]['beatmap_id'],
		recentScore[0]['mods_id'],
		perfectCombo,
		0,
		ifFcAcc
	);

	let grade = '';
	let percentPlayed = undefined;
	if (recentScore[0]['passed'] == false) {
		percentPlayed = (recentScore[0]['maximum_statistics']['great']) / (recentScore[0]['beatmap']['count_circles'] + recentScore[0]['beatmap']['count_sliders'] + recentScore[0]['beatmap']['count_spinners']);
		grade = `F (${(percentPlayed * 100).toFixed(2)}%)`;
	} else {
		grade = recentScore[0]['rank'];
	}

	let modsString = '';
	for (const mod in recentScore[0]['mods']) {
		modsString = modsString + recentScore[0]['mods'][mod]['acronym'];
	}

	let ppText = '';
	if (recentScore[0]['max_combo'] == (recentScore[0]['maximum_statistics']['great'] + recentScore[0]['maximum_statistics']['legacy_combo_increase'])) {
		ppText = `${ppCalc['pp']['current']}`;
	} else {
		ppText = `${ppCalc['pp']['current'].toLocaleString()} (${ppCalc['pp']['fc'].toLocaleString()} for ${ifFcAcc}% fc)`;
	}

	await message.reply({
		embeds: [
			{
				author: { name: `${details['username']} (#${details['rank_history']['data'][89]})`, url: `https://osu.ppy.sh/u/${details['id']}` },
				title: `${recentScore[0]['beatmapset']['title']} [${recentScore[0]['beatmap']['version']}] +${modsString} [${ppCalc['stats']['star']['pure']}*]`,
				url: `${recentScore[0]['beatmap']['url']}`,
				fields: [
					{ name: 'grade', value: grade, inline: true },
					{ name: 'score', value: `${recentScore[0]['total_score'].toLocaleString()}`, inline: true },
					{ name: 'combo', value: `${recentScore[0]['max_combo'].toLocaleString()} / ${(perfectCombo).toLocaleString()}`, inline: true },
					{ name: 'pp', value: ppText, inline: true },
					{ name: 'accuracy', value: `${(recentScore[0]['accuracy'] * 100).toFixed(2)}%`, inline: true },
					{ name: 'hits', value: `${num300s.toLocaleString()} / ${num100s.toLocaleString()} / ${num50s.toLocaleString()} / ${numMiss.toLocaleString()}`, inline: true },
				],
				image: { url: `${recentScore[0]['beatmapset']['covers']['card@2x']}` },
				color: rgbInt(22, 145, 217),
				timestamp: recentScore[0]['ended_at'],
			},
		],
	});
}