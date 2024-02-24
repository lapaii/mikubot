declare module "bun" {
    interface Env {
        TOKEN: string,
		CLIENT_ID: number,
		GUILD_ID: number,
		OSU_CLIENT_ID: number,
		OSU_CLIENT_SECRET: string,
    }
}