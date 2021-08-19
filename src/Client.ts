import { Client, Intents, Collection } from "discord.js";
import Command from './Command';

export default class WordClient extends Client {
    public readonly prefix = "?";
    public readonly commands: Collection<string, Command>;
    public readonly logger = m => console.log(m);
    constructor(options = {}) {
        super({
            // @ts-ignore
            intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_BANS", "GUILD_MESSAGES", "DIRECT_MESSAGES", "GUILD_INVITES", "GUILD_MESSAGE_REACTIONS"],
			http: { version: 9 }
        });
        this.commands = new Collection();
    }

    public async start(token: string): Promise<void> {
        this.login(token);
    }
}