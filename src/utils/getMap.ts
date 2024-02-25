import { request } from "./request";

export async function getMapData(id: number): Promise<string> {
    const map = await request(`https://osu.ppy.sh/osu/${id}`);

    return map;
}
