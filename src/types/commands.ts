import { Client, POSTApplicationCommandStructure, Interaction, ApplicationCommandData, Message } from "lilybird";

export interface MessageCommand {
    name: string;
    aliases?: Array<string>;
    cooldown: number;
    description: string;
    flags?: string;
    run: ({ client, message, args, prefix, index, commandName }: { client: Client, message: Message, args: Array<string>, prefix: string, index: number | undefined, commandName: string }) => Promise<void>;
}

export interface SlashCommand {
    data: POSTApplicationCommandStructure;
    run: (interaction: Interaction<ApplicationCommandData>) => Promise<void>;
}

export interface DefaultSlashCommand {
	default: SlashCommand;
}

export interface DefaultMessageCommand {
	default: MessageCommand;
}