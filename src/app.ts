import express, { Express } from "express";
import cors from 'cors';
import router from './router/index';
import { connectDb, disconnectDB } from '../src/database/index';

const app = express();

app.use(cors())
    .use(express.json())
    .use(router);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running at port: ${PORT}`))

export function init(): Promise<Express> {
    connectDb();
    return Promise.resolve(app);
}

export async function close(): Promise<void> {
    await disconnectDB();
}


export default app;