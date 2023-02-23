import { User } from "@prisma/client";
import bcrypt from "bcrypt"
import { create, findByEmail } from "../../repositories/users-repositories/index.js";
import { existsEmailError } from "./errors.js";

export type UserCreateParams = Pick<User, "email" | "password">;

export async function createUser({ email, password }: UserCreateParams): Promise<User> {

    await validateUniqueEmailOrFail(email);

    const hashedPassword = await bcrypt.hash(password, 12);

    console.log(hashedPassword)

    return create({
        email,
        password: hashedPassword,
    });

}

async function validateUniqueEmailOrFail(email: string) {

    const userWithSameEmail = await findByEmail(email);

    if (userWithSameEmail) {

        throw existsEmailError();

    }

}