import { Response } from "express"
import httpStatus from "http-status";
import { postCredential } from "../services/credential-service/index";
import { AuthenticatedRequest } from "../middleware/authentication-middleware";

async function createCredential(req: AuthenticatedRequest, res: Response) {

    const { userId } = req;
    const { title, url, username, password } = req.body;

    try {

        await postCredential({ userId, title, url, username, password });

        return res.sendStatus(httpStatus.OK)

    } catch (error) {

        if(error.name === "credentialsAlreadyExists") {

            return res.status(httpStatus.BAD_REQUEST).send(error);

        }

        return res.status(httpStatus.UNAUTHORIZED).send(error);

    }

}

export {
    createCredential
}
