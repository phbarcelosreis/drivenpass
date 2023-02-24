import { Response } from "express"
import httpStatus from "http-status";
import { credentialDelete, postCredential, returnCredential } from "../services/credential-service/index";
import { AuthenticatedRequest } from "../middleware/authentication-middleware";

async function createCredential(req: AuthenticatedRequest, res: Response) {

    const { userId } = req;
    const { title, url, username, password } = req.body;

    try {

        const credential = await postCredential({ userId, title, url, username, password });

        return res.status(httpStatus.OK).send(credential);

    } catch (error) {

        if(error.name === "credentialsAlreadyExists") {

            return res.status(httpStatus.BAD_REQUEST).send(error);

        }

        return res.status(httpStatus.UNAUTHORIZED).send(error);

    }

}

async function getCredential(req: AuthenticatedRequest, res: Response) {

    const { userId } = req;
    const { credentialId } = req.body;

    try {

        const credential = await returnCredential({ userId, credentialId });

        return res.status(httpStatus.OK).send(credential);

    } catch (error) {

        if(error.name === "notFoundCredential") {

            return res.status(httpStatus.NOT_FOUND).send(error);

        }

        return res.status(httpStatus.UNAUTHORIZED).send(error);

    }

}

async function deleteCredential (req: AuthenticatedRequest, res: Response) {

    const { userId } = req;
    const { credentialId } = req.body;

    try {

        await credentialDelete({ userId, credentialId });

        return res.sendStatus(httpStatus.OK)

    } catch (error) {

        if(error.name === "notFoundCredential") {

            return res.status(httpStatus.NOT_FOUND).send(error);

        }

        return res.status(httpStatus.UNAUTHORIZED).send(error);

    }

}

export {
    createCredential,
    getCredential,
    deleteCredential
}
