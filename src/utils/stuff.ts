interface mods {
	[index: number]: {
		[acronym: string]: string;
	}
}

export function generateModString(mods: mods) {
	let modString = '';
	for (const mod in mods) {
		modString = modString + mods[mod]['acronym'];
	}

	return modString;
}

export function rgbInt(r: number, g: number, b: number ): number {
	return 65536 * r + 256 * g + b;
}