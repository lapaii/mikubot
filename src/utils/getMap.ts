import { request } from "./request";

export async function getMapData(id: number): Promise<string> {
    console.log(`downloading map id ${id}`);
    const map = await request(`https://osu.ppy.sh/osu/${id}`);

    return map;
}
