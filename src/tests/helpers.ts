import dotenv from "dotenv"
import prisma from "../database/index.js";


dotenv.config();

export async function cleanDb() {

    await prisma.credential.deleteMany({});
    await prisma.network.deleteMany({});
    await prisma.user.deleteMany({});

}