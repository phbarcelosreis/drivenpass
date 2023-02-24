import { Prisma } from "@prisma/client";
import prisma from "../../database/index";

async function create(data: Prisma.UserUncheckedCreateInput) {

    console.log(data)

    return prisma.user.create({

        data,

    });

}

async function findByEmail(email: string, select?: Prisma.UserSelect) {
    const params: Prisma.UserFindUniqueArgs = {

        where: {
            email,
        },

    };

    if (select) {

        params.select = select;

    }

    return prisma.user.findUnique(params);
}

export {

    create,
    findByEmail

}