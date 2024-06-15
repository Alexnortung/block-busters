import { Client, Collection, Events, GatewayIntentBits, Routes } from 'discord.js';
import { whitelist } from './commands';
import type { Command } from './types';

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;

if (!DISCORD_TOKEN) {
    console.error('DISCORD_TOKEN is required');
    process.exit(1);
}

if (!CLIENT_ID) {
    console.error('CLIENT_ID is required');
    process.exit(1);
}

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
    ],
});

const commands = [
    whitelist.add,
];
type CommandName = typeof commands[number]['name'];

const commandCollection = new Collection<CommandName, Command>();

commands.forEach((command) => {
    commandCollection.set(command.name, command);
});

const registerCommands = async () => {
    const commandsDataArray = commands.map((command) => command.commandData);
    await client.rest.put(
        Routes.applicationCommands(CLIENT_ID),
        {
            body: commandsDataArray,
        }
    );
};

client.once(Events.ClientReady, async (readyClient) => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
    const commandsDataArray = commands.map((command) => command.commandData);
    try {
        await registerCommands();
        console.log('Commands registered');
    } catch (error) {
        console.error(error);
    }
});

client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isCommand()) return;
    const command = commandCollection.get(interaction.commandName);

    if (!command) {
        console.error(`Command not found: ${interaction.commandName}`);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({
            content: 'There was an error while executing this command!',
            ephemeral: true,
        });
    }
});

client.login(DISCORD_TOKEN);
