const enum Mode {
    OSU = "osu",
    MANIA = "mania",
    TAIKO = "taiko",
    FRUITS = "fruits"
}

export function accuracyCalculator(mode: Mode, hits: {
    count_300: number | null,
    count_100: number | null,
    count_50: number | null,
    count_miss: number | null,
    count_geki: number | null,
    count_katu: number | null
}): number {
    let {
        count_100: count100,
        count_300: count300,
        count_50: count50,
        count_geki: countGeki,
        count_katu: countKatu,
        count_miss: countMiss
    } = hits;
    count100 ??= 0;
    count300 ??= 0;
    count50 ??= 0;
    countGeki ??= 0;
    countKatu ??= 0;
    countMiss ??= 0;

    let acc = 0.0;

    switch (mode) {
        case Mode.OSU: acc = (6 * count300 + 2 * count100 + count50) / (6 * (count50 + count100 + count300 + countMiss)); break;
        case Mode.TAIKO: acc = (2 * count300 + count100) / (2 * (count300 + count100 + countMiss)); break;
        case Mode.FRUITS: acc = count300 + count100 + count50 + countKatu + countMiss; break;
        case Mode.MANIA: acc = (6 * countGeki + 6 * count300 + 4 * countKatu + 2 * count100 + count50) / (6 * (count50 + count100 + count300 + countMiss + countGeki + countKatu)); break;
    }

    return 100 * acc;
}
