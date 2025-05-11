import { PrismaClient } from '@prisma/client';
import { checkServersStatus } from './serverService';
import { gameModes } from '../config/servers';

const prisma = new PrismaClient();

export const WritingDatabaseOne = async () => {
    const statuses = await checkServersStatus(gameModes);
    
    await Promise.all(statuses.map(async (mode) => {
        await prisma.statisticsModesOne.create({
            data: {
                gameMode: mode.name,
                onlinePlayers: mode.totalPlayers,
            },
        });
    }));
};
