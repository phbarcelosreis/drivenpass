import {prisma} from "../../database/index";

export async function findNetworkByUserIdAndNetworkTitle({ userId, networkTitle }) {

    const networks = await prisma.network.findMany({
        where: {

            userId,

        },

    });

    const result = networks.find((network) => network.network === networkTitle);

    return result;

}


export async function insertNetwork({ userId, networkTitle, title, password }) {

    const network = await prisma.network.create({
        data: {

            userId,
            network: networkTitle,
            title,
            password

        },
    });

    return network.id

}

export async function getAllNetworksByUserId({ userId }) {

    const allNetworks = prisma.network.findMany({
        where: {

            userId: userId

        }
    })

    return allNetworks;

}

export async function getNetworkByNetworkId({ userId, networkId }) {

    const allNetworks = prisma.network.findMany({
        where: {

            id: networkId,
            userId: userId

        }
    })

    return allNetworks;

}

export async function deleteNetwork({ networkId }) {
    
    const deletedNetwork = await prisma.network.delete({
        where: {

            id: networkId

        },
    });

    return deletedNetwork;

}