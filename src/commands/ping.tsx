import { SlashCommand } from "@lilybird/handlers";
import { ApplicationCommandData, Interaction } from "lilybird";

export default {
	post: "GLOBAL",
	data: {
		name: "ping",
		description: "gives ping of bot"
	},
	run
} satisfies SlashCommand;

async function run(interaction: Interaction<ApplicationCommandData>): Promise<void> {
	const { ws, rest } = await interaction.client.ping();

	await interaction.reply({
		content: `websocket: ${ws}ms\nrest: ${rest}ms`
	});
}