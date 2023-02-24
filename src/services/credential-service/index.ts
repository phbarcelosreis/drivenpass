import { deleteCredential, findCredentialByUserIdAndTitle, getAllCredentialsByUserId, getCredentialByCredentialId, insertCredential } from "../../repositories/credentials-repositories/index";
import { duplicatedCredentialError, notFoundCredential } from "./errors";
import Cryptr from 'cryptr';
import { credentialsSchema } from "../../schemas/credentials.schema";
import { number } from "joi";

export async function postCredential({ userId, title, url, username, password }) {

    const obj = {

        title,
        url,
        username,
        password

    }

    const validation = credentialsSchema.validate(obj);

    if (validation.error) {

        const errors = validation.error.details.map((detail: { message: string; }) => detail.message);
        throw errors;

    }

    const duplicatedCredential = await findCredentialByUserIdAndTitle(userId, title);

    if (duplicatedCredential) {

        throw duplicatedCredentialError();

    }

    const cryptr = new Cryptr(process.env.CRYPTR_SECRET);

    const passwordCryptr = cryptr.encrypt(password);

    const credential = await insertCredential({ userId, title, url, username, password: passwordCryptr });

    return { credentialId: credential }


}

export async function returnCredential({ userId, credentialId }) {

    if (!credentialId) {

        const allCredentials = await getAllCredentialsByUserId(userId);

        if (!allCredentials) {

            throw notFoundCredential();

        }

        const cryptr = new Cryptr(process.env.CRYPTR_SECRET)

        const decryptedCredentials = allCredentials.map((credential) => {

            const newPassword = cryptr.decrypt(credential.password);

            return {

                id: credential.id,
                title: credential.title,
                url: credential.url,
                username: credential.username,
                password: newPassword,
                userId: credential.userId

            }

        });

        return decryptedCredentials;

    }

    const credentialById = await getCredentialByCredentialId({ userId, credentialId });

    if (credentialById.length === 0) {

        throw notFoundCredential();

    }

    const cryptr = new Cryptr(process.env.CRYPTR_SECRET)

    const newPassword = cryptr.decrypt(credentialById[0].password);

    const newCredential = {
        id: credentialById[0].id,
        title: credentialById[0].title,
        url: credentialById[0].url,
        username: credentialById[0].username,
        password: newPassword,
        userId: credentialById[0].userId,
    }


    return newCredential;

}

export async function credentialDelete({ userId, credentialId }) {

    console.log(`retornando: ${credentialId}`)

    if(!credentialId) {

        notFoundCredential()

    }


    const checkCredential = await getCredentialByCredentialId({ userId, credentialId })

    console.log(checkCredential)

    if (checkCredential.length === 0) {

        throw notFoundCredential();

    }

    return deleteCredential({ credentialId });

}