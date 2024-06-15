import { CommandInteraction, SlashCommandBuilder, type Interaction } from "discord.js";
import { type Command } from "../../types";
import { fetchMinecraftPlayerData } from "../../lib/apis/minecraft-id";
import { whitelistAdd } from "../../lib/apis/minecraft-rcon";
import { repositoryDispatchWhitelistAdd } from "../../lib/apis/external-whitelist";

export const name = 'whitelistadd' as const;

const USERNAME_OPTION = 'username';

export const commandBuilder = new SlashCommandBuilder()
    .setName(name)
    .setDescription('Add a user to the whitelist')
    .addStringOption(option => option
        .setName(USERNAME_OPTION)
        .setDescription('The user to add to the whitelist')
        .setRequired(true)
    );

export const execute = async (interaction: CommandInteraction) => {
    const usernameOption = interaction.options.get(USERNAME_OPTION);
    const username = usernameOption?.value;
    if (typeof username !== 'string') {
        console.log('username:', username);
        interaction.reply({
            content: 'Invalid username',
            ephemeral: true,
        });
        return;
    }

    const playerData = await fetchMinecraftPlayerData(username);
    const apiUsername = playerData.data.player.username;
    const apiId = playerData.data.player.id;
    try {
        await Promise.all([
            whitelistAdd(apiUsername),
            repositoryDispatchWhitelistAdd(apiUsername, apiId),
        ]);
    } catch (error) {
        console.error(error);
        interaction.reply({
            content: `Failed to add ${apiUsername} to the whitelist`,
            ephemeral: true,
        });
        return;
    }

    interaction.reply({
        content: `Added ${apiUsername} to the whitelist`,
    });
}

const command: Command = {
    name,
    commandData: commandBuilder,
    execute,
};

export default command;
