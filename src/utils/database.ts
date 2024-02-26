import { getMapData } from "./getMap";
import { Database } from "bun:sqlite";
import { v2 } from "osu-api-extended";

interface Columns {
    cid: number;
    name: string;
    type: string;
    notnull: number;
    dflt_value: any;
    pk: number;
}

interface DatabaseUser {
    discordId: string;
    osuId: string | null;
    prefMode: number | null;
}

interface DatabaseMap {
    diffId: number;
    data: string;
}

const db = new Database("database.sqlite", { create: true });

export function readyDatabase(): void {
    const tables = [
        { name: "userdata", columns: ["discordId TEXT PRIMARY_KEY", "osuId TEXT", "prefMode INT"] },
        { name: "maps", columns: ["diffId TEXT PRIMARY_KEY", "data BLOB"] }
    ];

    for (const table of tables) {
        db.run(`CREATE TABLE IF NOT EXISTS ${table.name} (${table.columns.join(", ")});`);

        const currentColumns = <Array<Columns>>db.prepare(`PRAGMA table_info(${table.name});`).all();

        for (const columnNameTable of table.columns) {
            const { 0: columnName } = columnNameTable.split(" ");

            const doesColumnExist = currentColumns.some(function (col) {
                return col.name === columnName;
            });

            if (!doesColumnExist) {
                db.run(`ALTER TABLE ${table.name} ADD COLUMN ${columnNameTable};`);
                console.log(`added column ${columnNameTable} into table ${table.name}`);
            }
        }

        for (const column of currentColumns) {
            const columnName = column.name;
            const isColumnInTable = table.columns.some(function (col) {
                return col.startsWith(columnName);
            });

            if (!isColumnInTable) {
                db.run(`ALTER TABLE ${table.name} DROP COLUMN ${columnName};`);
                console.log(`removed column ${columnName} from table ${table.name}`);
            }
        }
    }

    console.log("database successfully up and configured");
}

export async function getOsuIdFromDiscord(discordUserId: string, usernameToLink: string): Promise<number> {
    const data: DatabaseUser | null = db.prepare("SELECT * FROM userdata WHERE discordId = ?").get(discordUserId) as DatabaseUser | null;

    if (typeof data?.osuId === "number") return data.osuId;

    const userId = (await v2.user.details(usernameToLink)).id;

    if (userId) {
        db.run(`INSERT INTO userdata VALUES (${discordUserId}, ${userId})`);
        return userId;
    }

    return -1;
}

export async function getMapFromId(diffId: number): Promise<string> {
    const start = performance.now();
    const data: DatabaseMap | null = db.prepare("SELECT * FROM maps WHERE diffId = ?").get(diffId) as DatabaseMap | null;

    if (data !== null) {
        console.log(`map ${diffId} already exists in db, decoding it`);

        const end = performance.now();
        console.log(`loading map from db took ${(end - start) / 1000}s`);

        return data.data;
    }

    const mapData = await getMapData(diffId);

    db.run("INSERT INTO maps VALUES (?, ?)", [diffId, mapData]);

    return mapData;
}
