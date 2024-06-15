// import { Rcon } from 'rcon-client';
import { RCONClient } from '@minecraft-js/rcon';

const HOST = process.env.MINECRAFT_RCON_HOST;
const PASSWORD = process.env.MINECRAFT_RCON_PASSWORD ?? '';
const PORT = process.env.MINECRAFT_RCON_PORT ? parseInt(process.env.MINECRAFT_RCON_PORT) : 25575;

const TIMEOUT = 1000;

if (!HOST) {
    console.error('MINECRAFT_RCON_HOST is required');
    process.exit(1);
}

export const whitelistAdd = (username: string) => {
    return new Promise<void>((resolve, reject) => {
        const client = new RCONClient(HOST, PASSWORD, PORT);

        const timeoutId = setTimeout(() => {
            client.disconnect();
            client.removeAllListeners('authenticated');
            reject(new Error('Timeout'));
        }, TIMEOUT);

        const onReady = async () => {
            const command = `whitelist add ${username}`;
            await client.executeCommandAsync(command);
            clearTimeout(timeoutId);
            client.disconnect();
            client.removeAllListeners('authenticated');
            resolve();
        }
        client.on('authenticated', onReady);

        client.connect()
    });
};

// export const whitelistAdd = async (username: string) => {
//     const rcon = await Rcon.connect({
//         host: HOST,
//         port: PORT,
//         password: PASSWORD,
//     });
//
//     rcon.
// };
