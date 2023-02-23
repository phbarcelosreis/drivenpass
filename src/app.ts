import express from 'express';
import cors from 'cors';
import { router } from './router/index.js';

const app = express();

app.use(cors())
    .use(express.json())
    .use(router);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running at port: ${PORT}`))
