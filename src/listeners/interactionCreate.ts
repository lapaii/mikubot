import { applicationCommands } from "../utils/init.js";
import type { Interaction } from "lilybird";

export default {
    event: "interactionCreate",
    run: (interaction: Interaction) => {
        if (interaction.isApplicationCommandInteraction() && interaction.inGuild()) {
            const defaultCommand = applicationCommands.get(interaction.data.name);
            if (!defaultCommand) return;
            const { default: command } = defaultCommand;

            command.run(interaction).catch((error: Error) => {
                console.log(`[error] error in application command ${command.data.name}: ${error.stack}`);
            });

            return;
        }
    }
};
