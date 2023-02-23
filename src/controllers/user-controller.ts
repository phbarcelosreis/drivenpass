import { Response, Request } from "express";
import httpStatus from "http-status";
import prisma from "../database/index.js";
import { checkSignIn, createUser } from "../services/users-service/index.js";

async function userPostSignIn(req: Request, res: Response) {

    const { email, password } = req.body;

    try {

        const signIn = await checkSignIn({ email, password });

        return res.status(httpStatus.OK).send(signIn)


    } catch (error) {

        return res.status(httpStatus.BAD_REQUEST).send(error);

    }

}

async function userPostSignUp(req: Request, res: Response) {

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

export async function teste(req: Request, res: Response) {


    return res.send(await prisma.session.findMany()) 

}

export {
    userPostSignIn,
    userPostSignUp
}