import { getOsuIdFromDiscord } from "../../utils/database";
import type { MessageCommand } from "../../types/commands";
import type { Message } from "lilybird";

export default {
    name: "link",
    description: "link an osu account to your discord",
    cooldown: 1000,
    run
} satisfies MessageCommand;

async function run({ message, args }: { message: Message, args: Array<string> }): Promise<void> {
    const { 0: usernameToLink } = args;
    const userId = await getOsuIdFromDiscord(message.author.id, usernameToLink);
    if (userId >= 0) {
        await message.reply(`${usernameToLink} successfully linked!`);
        return;
    }

    await message.reply(`user not found with username ${usernameToLink}`);
}
