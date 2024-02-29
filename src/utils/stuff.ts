import type { Mod } from "osu-api-extended/dist/types/mods.js";

export function generateModString(mods: Array<Mod>): string {
    let modString = "";
    for (let index = 0; index < mods.length; index++) modString += mods[index].acronym;

    return modString;
}

export function rgbInt(r: number, g: number, b: number): number {
    return 65536 * r + 256 * g + b;
}

export function generateGradeString(passedObjects: number, objectCount: number, rank: string): string {
    const percentPlayed = passedObjects / objectCount * 100;
    if (percentPlayed === 100) return rank;
    return `F (${percentPlayed.toFixed(2)}%)`;
}
