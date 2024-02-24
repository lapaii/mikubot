import type { Client } from "lilybird";
import type { Event } from "@lilybird/handlers";

export default {
	event: "ready",
	run: async (client: Client) => {
		console.log(`logged in as ${client.user.username}#${client.user.discriminator}`);
	}
} satisfies Event<"ready">;