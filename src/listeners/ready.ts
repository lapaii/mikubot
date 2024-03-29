import { loadMessageCommands } from "../utils/init";
import { auth } from "osu-api-extended";
import type { Client } from "lilybird";
import type { Event } from "@lilybird/handlers";

export default {
    event: "ready",
    run: async (client: Client) => {
        console.log(`logged in as ${client.user.username}#${client.user.discriminator}`);
        console.log("attempting to load message commands");
        await loadMessageCommands();
        console.log("message commands loaded");
        // console.log("attempting to load application commands");
        // await loadApplicationCommands(client);
        // console.log("application commands loaded");
        console.log("attempting to authenticate with osu! api");
        await auth.login(process.env.OSU_CLIENT_ID, process.env.OSU_CLIENT_SECRET, ["public"]);
        console.log("successfully authenticated with osu! api");
        console.log("bot now ready for use");
    }
} satisfies Event<"ready">;
