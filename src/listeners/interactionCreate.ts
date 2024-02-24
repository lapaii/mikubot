import { Interaction, InteractionData, Message } from "lilybird";
import { applicationCommands } from "../utils/init.js";

export default {
	event: "interactionCreate",
	run: async (interaction: Interaction<InteractionData, Message | undefined>) => {
		if (interaction.isApplicationCommandInteraction() && interaction.inGuild()) {
			const defaultCommand = applicationCommands.get(interaction.data.name);
			if (!defaultCommand) return;
			const { default: command } = defaultCommand;

			command.run(interaction).catch(async (error: Error) => {
				console.log(`[error] error in application command ${command.data.name}: ${error.stack}`)
			});

			return;
		}
	}
}