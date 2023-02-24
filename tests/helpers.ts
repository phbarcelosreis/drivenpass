import dotenv from "dotenv"
import prisma from "../src/database";


dotenv.config();

export async function cleanDb() {

    await prisma.session.deleteMany({});
    await prisma.credential.deleteMany({});
    await prisma.network.deleteMany({});
    await prisma.user.deleteMany({});

}