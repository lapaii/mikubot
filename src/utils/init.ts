import { readdir } from "fs/promises";
import type { DefaultMessageCommand, DefaultSlashCommand } from "../types/commands.js";
import type { Client as LilybirdClient, POSTApplicationCommandStructure } from "lilybird";

export const messageCommands = new Map<string, DefaultMessageCommand>();
export const commandAliases = new Map<string, string>();
export const applicationCommands = new Map<string, DefaultSlashCommand>();

export async function loadApplicationCommands(client: LilybirdClient): Promise<void> {
    const slashCommands: Array<POSTApplicationCommandStructure> = [];
    const temp: Array<Promise<DefaultSlashCommand>> = [];

    const files = await readdir("./src/commands", { recursive: true });

    for (const command of files) {
        const [category, cmd] = command.split("/");
        if (!category || !cmd) continue;

        const commandToPushTemp = import(`../commands/${category}/${cmd}`) as Promise<DefaultSlashCommand>;
        temp.push(commandToPushTemp);
    }

    const tempCommands = await Promise.all(temp);
    for (const command of tempCommands) {
        const { default: cmd } = command;
        slashCommands.push(cmd.data);
        applicationCommands.set(cmd.data.name, command);
    }

    await client.rest.bulkOverwriteGlobalApplicationCommand(client.user.id, slashCommands);
}

export async function loadMessageCommands(): Promise<void> {
    const temp: Array<Promise<DefaultMessageCommand>> = [];

    const files = await readdir("./src/messageCommands", { recursive: true });

    for (const command of files) {
        const [category, cmd] = command.split("/");
        if (!category || !cmd) continue;

        const commandToPushTemp = import(`../messageCommands/${category}/${cmd}`) as Promise<DefaultMessageCommand>;
        temp.push(commandToPushTemp);
    }

    const tempCommands = await Promise.all(temp);
    for (const command of tempCommands) {
        const { default: cmd } = command;

        messageCommands.set(cmd.name, command);

        if (cmd.aliases && cmd.aliases.length > 0 && Array.isArray(cmd.aliases)) {
            cmd.aliases.forEach((alias) => {
                commandAliases.set(alias, cmd.name);
            });
        }
    }
}
