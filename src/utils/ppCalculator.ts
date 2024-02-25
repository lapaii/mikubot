import { tools } from "osu-api-extended";
import { request } from "./request.js";
import { Beatmap, Calculator } from "rosu-pp";

interface ppCalc {
	id: number,
	mods: number,
	num300s: number,
	num100s: number,
	num50s: number,
	numMiss: number,
	combo: number,
}

export async function calculatePP({ id, mods, num300s, num100s, num50s, numMiss, combo }: ppCalc) {
	const mapDownload = await request(`https://osu.ppy.sh/osu/${id}`);

	const map = new Beatmap().fromContent(mapDownload);

	const calc = new Calculator();

	const current = calc.n300(num300s).n100(num100s).n50(num50s).nMisses(numMiss).mods(mods).combo(combo).performance(map);

	console.log(`${current.pp}`);
}