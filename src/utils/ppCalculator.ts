import { getMapFromId } from "./database";
import { Beatmap, Calculator } from "rosu-pp";
import type { PpCalc, PpCalcResult } from "../types/ppcalc";

export async function calculatePP({ id, mods, num300s, num100s, num50s, numMiss, combo, maxCombo }: PpCalc): Promise<PpCalcResult> {
    const mapData = await getMapFromId(id);

    const map = new Beatmap().fromContent(mapData);

    const calc = new Calculator();

    const current = calc.mode(0).n300(num300s).n100(num100s).n50(num50s)
        .nMisses(numMiss)
        .mods(mods)
        .combo(combo)
        .performance(map);

    let ifFc = undefined;
    if ("effectiveMissCount" in current) {
        if ("effectiveMissCount" in current && current.effectiveMissCount > 0) {
            ifFc = calc.mode(0).n300(num300s + numMiss).n100(num100s).n50(num50s)
                .nMisses(0)
                .combo(maxCombo)
                .performance(map);
        }
    }

    return { current, ifFc };
}
