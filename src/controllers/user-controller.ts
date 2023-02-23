import { Response, Request } from "express";
import httpStatus from "http-status";
import prisma from "../database/index.js";
import { createUser } from "../services/users-service/index.js";

async function userGet(req: Request, res: Response) {

    const users = await prisma.user.findMany();

    res.send(users)

}

async function userPost(req: Request, res: Response) {

    const { email, password } = req.body;

    try {

        const user = await createUser({ email, password });

        return res.status(httpStatus.CREATED).json({
            id: user.id,
            email: user.email,
        });

    } catch (error) {

        if (error.name === "EmailAlreadyExists") {

            return res.status(httpStatus.CONFLICT).send(error);

        }

        return res.status(httpStatus.BAD_REQUEST).send(error);

    }

}

export {
    userGet,
    userPost
}