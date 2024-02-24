import type { Client } from "lilybird";
import type { Event } from "@lilybird/handlers";
import { loadApplicationCommands, loadMessageCommands } from "src/utils/init.js";

export default {
	event: "ready",
	run: async (client: Client) => {
		console.log(`logged in as ${client.user.username}#${client.user.discriminator}`);
		console.log('attempting to load message commands');
		await loadMessageCommands();
		console.log('message commands loaded');
		// console.log('attempting to load application commands');
		// await loadApplicationCommands(client);
		// console.log('application commands loaded');
	}
} satisfies Event<"ready">;