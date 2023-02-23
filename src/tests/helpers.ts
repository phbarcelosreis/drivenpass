import prisma from "../database/index.js";

export async function cleanDb() {
    await prisma.user.deleteMany({});
}