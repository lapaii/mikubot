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