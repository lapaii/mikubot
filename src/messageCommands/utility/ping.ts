import type { MessageCommand } from "../../types/commands.js";
import type { Message } from "lilybird";

export default {
    name: "ping",
    description: "gives ping of bot",
    cooldown: 1000,
    run
} satisfies MessageCommand;

async function run({ message }: { message: Message }): Promise<void> {
    const pingMessage = await message.reply({
        content: "pinging..."
    });

    const { ws, rest } = await message.client.ping();

    await pingMessage.edit({
        content: "",
        embeds: [
            {
                title: "ping",
                description: `websocket: ${ws}ms\nrest: ${rest}ms`,
                color: 60
            }
        ]
    });
}
