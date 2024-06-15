import { CommandInteraction, SlashCommandBuilder, type Interaction } from "discord.js";
import { type Command } from "../../types";
import { fetchMinecraftPlayerData } from "../../lib/apis/minecraft-id";
import { whitelistAdd } from "../../lib/apis/minecraft-rcon";

export const name = 'whitelistadd' as const;

export const commandBuilder = new SlashCommandBuilder()
    .setName(name)
    .setDescription('Add a user to the whitelist')
    .addStringOption(option => option
        .setName('user')
        .setDescription('The user to add to the whitelist')
        .setRequired(true)
    );

export const execute = async (interaction: CommandInteraction) => {
    await interaction.reply('whitelistAdd command');
    const username = interaction.options.get('user');

    if (typeof username !== 'string') {
        interaction.reply({
            content: 'Invalid username',
            ephemeral: true,
        });
        return;
    }

    const playerData = await fetchMinecraftPlayerData(username);
    const apiUsername = playerData.data.player.username;
    const apiId = playerData.data.player.id;
    await whitelistAdd(apiUsername);
}

const command: Command = {
    name,
    commandData: commandBuilder,
    execute,
};

export default command;
