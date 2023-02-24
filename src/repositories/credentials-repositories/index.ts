import prisma from "../../database/index";

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

    await prisma.credential.create({
        data: { 

            userId, 
            title, 
            url, 
            username, 
            password 
            
        },
    });


}

