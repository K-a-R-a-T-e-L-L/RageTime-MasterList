import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const STEAM_API_KEY = process.env.STEAM_API_KEY;

if (!STEAM_API_KEY) {
    throw new Error('STEAM_API_KEY is not defined in environment variables');
}

interface ServerConfig {
    ip: string;
    port: number;
    name: string;
}

interface GameMode {
    name: string;
    servers: ServerConfig[];
}

interface ServerStatus {
    ip: string;
    port: number;
    name: string;
    online: boolean;
    players: number;
    gameMode?: string;
}

interface SteamServer {
    addr: string;
    players: number;
}

interface GameModeStatus {
    name: string;
    totalPlayers: number;
    totalServers: number;
    onlineServers: number;
    servers: ServerStatus[];
}

export const checkServersStatus = async (gameModes: GameMode[]): Promise<GameModeStatus[]> => {
    try {
        const allServers = gameModes.flatMap(mode =>
            mode.servers.map((server: ServerConfig) => ({
                ...server,
                gameMode: mode.name
            }))
        );

        const serversString = allServers
            .map(s => `${s.ip}:${s.port}`)
            .join(',');

        const response = await axios.get(`https://api.steampowered.com/IGameServersService/GetServerList/v1/`, {
            params: {
                filter: `\\appid\\730\\addr\\${serversString}`,
                key: STEAM_API_KEY
            }
        });

        const onlineServers = response.data.response.servers || [];

        const serversStatus = allServers.map(server => {
            const foundServer = onlineServers.find(
                (s: SteamServer) => s.addr === `${server.ip}:${server.port}`
            );

            return {
                ip: server.ip,
                port: server.port,
                name: server.name,
                online: !!foundServer,
                players: foundServer?.players || 0,
                gameMode: server.gameMode
            };
        });

        return gameModes.map(mode => {
            const modeServers = serversStatus.filter(
                server => server.gameMode === mode.name
            );

            return {
                name: mode.name,
                totalPlayers: modeServers.reduce((sum, server) => sum + server.players, 0),
                totalServers: modeServers.length,
                onlineServers: modeServers.filter(server => server.online).length,
                servers: modeServers
            };
        });

    } catch (error) {
        console.error('Error checking servers status:', error);
        return gameModes.map(mode => ({
            name: mode.name,
            totalPlayers: 0,
            totalServers: mode.servers.length,
            onlineServers: 0,
            servers: mode.servers.map((server: ServerConfig) => ({
                ip: server.ip,
                port: server.port,
                name: server.name,
                online: false,
                players: 0
            }))
        }));
    }
}; 