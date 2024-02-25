import { commandAliases, messageCommands } from "../utils/init";
import type { Message } from "lilybird";

export default {
    event: "messageCreate",
    run: async (message: Message) => {
        const { content, guildId, client, author } = message;

        if (!content || !guildId || author.bot) return;

        const channel = await message.fetchChannel();
        if (!channel.isText()) return;

        const prefix = ";";
        if (!content.startsWith(prefix)) return;

        const args = content.slice(prefix.length).trim().split(/ +/g);
        let commandName = args.shift()?.toLowerCase();
        if (!commandName) return;

        const alias = commandAliases.get(commandName);
        const commandDefault = alias ? messageCommands.get(alias) : messageCommands.get(commandName);

        let index: number | undefined;
        const match = (/(\D+)(\d+)/).exec(commandName);
        if (match) {
            const [, extractedCommandName, extractedNumber] = match;
            commandName = extractedCommandName;
            index = parseInt(extractedNumber) - 1;
        }

        if (!commandDefault) return;
        const { default: command } = commandDefault;

        command.run({ client, message, args, prefix, index, commandName }).catch((error: Error) => {
            console.log(`[error] error in message command ${command.name}: ${error.stack}`);
        });

        return;
    }
};
