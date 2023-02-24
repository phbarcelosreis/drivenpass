import prisma from "../../database/index";

export async function createValidSession(data: { token: string; userId: number; }) {

    return prisma.session.create({
        data,
    });

}