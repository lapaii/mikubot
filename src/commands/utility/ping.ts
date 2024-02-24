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
	await interaction.deferReply();

	await interaction.editReply({ embeds: 
		[
			{
				title: 'ping',
				description: `websocket: ${ws}ms\nrest: ${rest}`,
				color: 65,
			}
		]
	});
}