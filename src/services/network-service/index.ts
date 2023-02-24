import Cryptr from "cryptr";
import { deleteNetwork, findNetworkByUserIdAndNetworkTitle, getAllNetworksByUserId, getNetworkByNetworkId, insertNetwork } from "../../repositories/network-repositories";
import { networkSchema } from "../../schemas/network.schema";
import { duplicatedNetworkError, notFoundNetwork } from "../network-service/errors";

export async function postNetwork({ userId, networkTitle, title, password }) {

    const obj = {

        networkTitle,
        title,
        password

    }

    const validation = networkSchema.validate(obj);

    if (validation.error) {

        const errors = validation.error.details.map((detail: { message: string; }) => detail.message);
        throw errors;

    }

    const duplicatedNetwork = await findNetworkByUserIdAndNetworkTitle({userId, networkTitle});

    if (duplicatedNetwork) {

        throw duplicatedNetworkError();

    }

    const cryptr = new Cryptr(process.env.CRYPTR_SECRET);

    const passwordCryptr = cryptr.encrypt(password);

    const network = await insertNetwork({ userId, networkTitle, title, password: passwordCryptr });

    return { networkId: network }


}

export async function returnNetwork({ userId, networkId }) {

    if (!networkId) {

        const allNetworks = await getAllNetworksByUserId({userId});

        if (!allNetworks) {

            throw notFoundNetwork();

        }

        const Networks = allNetworks.map((network) => {


            return {

                id: network.id,
                networkTitle: network.network,
                title: network.title,
                password: network.password,
                userId: network.userId

            }

        });

        return Networks;

    }

    const networkById = await getNetworkByNetworkId({ userId, networkId });

    if (networkById.length === 0) {

        throw notFoundNetwork();

    }

    const newNetwork = {
        id: networkById[0].id,
        networkTitle: networkById[0].network,
        title: networkById[0].title,
        password: networkById[0].password,
        userId: networkById[0].userId,
    }


    return newNetwork;

}

export async function networkDelete({ userId, networkId }) {

    const networkById = await getNetworkByNetworkId({ userId, networkId });

    if (networkById.length === 0) {

        throw notFoundNetwork();

    }

    await deleteNetwork({ networkId });

}