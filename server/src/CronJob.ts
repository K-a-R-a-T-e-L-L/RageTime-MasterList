import { PrismaClient } from '@prisma/client';
import cron from 'node-cron';

const prisma = new PrismaClient();

cron.schedule('*/30 * * * *', async () => {
    console.log('Checking for records older than 24 hours in statisticsModesOne...');

    const currentTime = new Date();
    const twentyFourHoursAgo = new Date(currentTime.getTime() - 24 * 60 * 60 * 1000);

    const deletedRecordsOne = await prisma.statisticsModesOne.deleteMany({
        where: {
            time: {
                lt: twentyFourHoursAgo,
            },
        },
    });

    console.log(`Deleted ${deletedRecordsOne.count} records older than 24 hours`);
});

cron.schedule('*/30 * * * *', async () => {
    console.log('Checking for records older than 30 days in statisticsModesTwo...');

    const currentTime = new Date();
    const thirtyDaysAgo = new Date(currentTime.getTime() - 30 * 24 * 60 * 60 * 1000);

    const deletedRecordsTwo = await prisma.statisticsModesTwo.deleteMany({
        where: {
            time: {
                lt: thirtyDaysAgo,
            },
        },
    });

    console.log(`Deleted ${deletedRecordsTwo.count} records older than 30 days`);
});

process.on('SIGINT', async () => {
    await prisma.$disconnect();
    process.exit(0);
});
