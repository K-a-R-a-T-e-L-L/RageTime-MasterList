import express from 'express';
import cors from 'cors';
import routerOne from './routes/routerOne';
import routerTwo from './routes/routerTwo';
import dotenv from 'dotenv';
import { WritingDatabaseOne } from './services/databaseServiceOne';
import { WritingDatabaseTwo } from './services/databaseServiceTwo';
import './CronJob';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;


setInterval(async () => {
    try {
        await WritingDatabaseOne();
    } catch (error) {
        console.error('Error updating database:', error);
    }
}, 10000);

setInterval(async () => {
    try {
        await WritingDatabaseTwo();
    } catch (error) {
        console.error('Error updating database:', error);
    }
}, 5 * 60 * 1000);

app.use(cors());
app.use(express.json());
app.use(routerOne);
app.use(routerTwo);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 