import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const formatTime = (isoString: Date): string => {
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}.${month} ${hours}:${minutes}`;
};

export const getServersStatusTwo= async (req: Request, res: Response) => {
    try {
        const statuses = await prisma.statisticsModesTwo.findMany({
            orderBy: {
                time: 'asc'
            },
        });

        const response = statuses.map(status => ({
            gameMode: status.gameMode,
            onlinePlayers: status.onlinePlayers,
            time: formatTime(status.time),
        }));

        res.json(response);
        
    } catch (error) {
        console.error('Error in getServersStatus:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
