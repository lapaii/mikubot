import { createHandler } from "@lilybird/handlers";
import { createClient, Intents } from "lilybird";

const listeners = await createHandler({
	dirs: {
		listeners: `${import.meta.dir}/listeners`
	}
});

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