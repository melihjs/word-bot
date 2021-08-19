import { Message } from "discord.js";
import WordClient from "./Client";
import CommandOptions from './CommandOptions';
import * as db from 'quick.db';

export default class Command {
    public readonly client: WordClient;
    public readonly name: string;
    public readonly db = db;
    constructor(client: WordClient, options: CommandOptions, data = db) {
        this.client = client;
        this.name = options.name;
        this.db = data;
    }

    public async run(message: Message, args: string[]): Promise<any> {}
}