import type { CommandInteraction, SlashCommandOptionsOnlyBuilder } from "discord.js";

export interface Command {
    name: string;
    commandData: SlashCommandOptionsOnlyBuilder;
    execute: (interaction: CommandInteraction) => Promise<void>;
}
