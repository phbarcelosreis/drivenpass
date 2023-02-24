import { findCredentialByUserIdAndTitle, insertCredential } from "../../repositories/credentials-repositories/index";
import { duplicatedCredentialError } from "./errors";
import Cryptr from 'cryptr';
import { credentialsSchema } from "../../schemas/credentials.schema";

export async function postCredential({ userId, title, url, username, password }) {

    const obj = {

        title, 
        url, 
        username, 
        password

    }

    const validation = credentialsSchema.validate(obj);

    if(validation.error) {

        const errors = validation.error.details.map((detail: { message: string; }) => detail.message);
        throw errors;

    }

    const duplicatedCredential = await findCredentialByUserIdAndTitle(userId, title);

    if(duplicatedCredential) {

        throw duplicatedCredentialError();

    }

    const cryptr = new Cryptr(process.env.CRYPTR_SECRET);

    const passwordCryptr = cryptr.encrypt(password);

    await insertCredential({ userId, title, url, username, password: passwordCryptr });

}