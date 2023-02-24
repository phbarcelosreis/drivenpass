import {prisma} from "../../database/index";

export async function findCredentialByUserIdAndTitle(userId: number, title: string) {

    const credentials = await prisma.credential.findMany({
        where: {
            userId,
        },
    });

    const result = credentials.find((credential) => credential.title === title);

    return result;

}

export async function insertCredential({ userId, title, url, username, password }) {

    const credential = await prisma.credential.create({
        data: {

            userId,
            title,
            url,
            username,
            password

        },
    });

    return credential.id

}

export async function getAllCredentialsByUserId({ userId }) {

    const allCredentials = prisma.credential.findMany({
        where: {

            userId: userId

        }
    })

    return allCredentials;

}

type teste = {
    userId?: number,
    credentialId: number
}

export async function getCredentialByCredentialId({ userId, credentialId }: teste) {

    const credentials = await prisma.credential.findMany({
        where: {

            id: credentialId,
            userId:  userId

        }

    })

    console.log(credentials)

    return credentials;

}

export async function deleteCredential({ credentialId }: teste) {
    
    return prisma.credential.delete({
        where: {

            id:  credentialId

        },
    });

}


