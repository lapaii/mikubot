import { readyDatabase } from "./utils/database";
import { createHandler } from "@lilybird/handlers";
import { createClient, Intents } from "lilybird";

const listeners = await createHandler({
    dirs: {
        listeners: `${import.meta.dir}/listeners`
    }
});

readyDatabase();

await createClient({
    token: process.env.TOKEN,
    intents: [
        Intents.GUILDS,
        Intents.GUILD_MESSAGES,
        Intents.MESSAGE_CONTENT,
        Intents.GUILD_MEMBERS
    ],
    ...listeners
});
