import type { PerformanceAttributes } from "rosu-pp";

export interface PpCalc {
    id: number;
    mods: number;
    num300s: number;
    num100s: number;
    num50s: number;
    numMiss: number;
    combo: number;
    maxCombo: number;
}

export interface PpCalcResult {
    current: PerformanceAttributes;
    ifFc: PerformanceAttributes | undefined;
}
