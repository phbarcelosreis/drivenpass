import { Response } from "express";
import httpStatus from "http-status";
import { AuthenticatedRequest } from "middleware/authentication-middleware";
import { networkDelete, postNetwork, returnNetwork } from "../services/network-service/index";

async function createNetwork(req: AuthenticatedRequest, res: Response) {

    const { userId } = req;
    const { networkTitle, title, password } = req.body;

    try {

        const credential = await postNetwork({ userId, networkTitle, title, password });

        return res.status(httpStatus.OK).send(credential);

    } catch (error) {

        if(error.name === "networkAlreadyExists") {

            return res.status(httpStatus.BAD_REQUEST).send(error);

        }

        return res.status(httpStatus.UNAUTHORIZED).send(error);

    }

}

async function getNetwork(req: AuthenticatedRequest, res: Response) {

    const { userId } = req;
    const { networkId } = req.body;

    try {

        const credential = await returnNetwork({ userId, networkId });

        return res.status(httpStatus.OK).send(credential);

    } catch (error) {

        if(error.name === "notFoundCredential") {

            return res.status(httpStatus.NOT_FOUND).send(error);

        }

        return res.status(httpStatus.UNAUTHORIZED).send(error);

    }

}

async function deleteNetwork (req: AuthenticatedRequest, res: Response) {

    const { userId } = req;
    const { networkId } = req.body;

    try {

        await networkDelete({ userId, networkId });

        return res.sendStatus(httpStatus.OK)

    } catch (error) {

        if(error.name === "notFoundCredential") {

            return res.status(httpStatus.NOT_FOUND).send(error);

        }

        return res.status(httpStatus.UNAUTHORIZED).send(error);

    }

}

export {
    createNetwork,
    getNetwork,
    deleteNetwork
}