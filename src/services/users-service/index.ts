import { User } from "@prisma/client";
import bcrypt from "bcrypt"
import { create, findByEmail } from "../../repositories/users-repositories/index";
import { userSchema } from "../../schemas/users.schema";
import { existsEmailError, notFoundError } from "./errors";
import jwt from "jsonwebtoken"
import { createValidSession } from "../../repositories/user-session-repositories/index";

export type UserCreateParams = Pick<User, "email" | "password">;

export async function createUser({ email, password }: UserCreateParams): Promise<User> {

    await validateUniqueEmailOrFail(email);

    const user = {
        email,
        password
    }

    const validation = userSchema.validate(user);

    if (validation.error) {

        const errors = validation.error.details.map((detail: { message: string; }) => detail.message);
        throw errors;

    }

    const hashedPassword = await bcrypt.hash(password, 12);

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

export type SignInParams = Pick<User, "email" | "password">;

type ResultSignIn = {
    user: Pick<User, "id" | "email">;
    token: string;
};

export async function checkSignIn({ email, password }: SignInParams): Promise<ResultSignIn> {

    const user = await checkUser(email);

    await validatePassword(password, user.password);

    const token = await createSession(user.id);

    return {
        user: exclude(user, "password"),
        token,
    };

}

async function createSession(userId: number) {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET);
    await createValidSession({
        token,
        userId,
    });

    return token;
}

type CheckUserResult = Pick<User, "id" | "email" | "password">;

async function checkUser(email: string): Promise<CheckUserResult> {

    const user = await findByEmail(email, {

        id: true,
        email: true,
        password: true

    });

    if (!user) throw notFoundError();

    return user;
}

async function validatePassword(password: string, userPassword: string) {

    const isPasswordValid = await bcrypt.compare(password, userPassword);

    if (!isPasswordValid) throw "Invalid Password";

}

function exclude<T, Key extends keyof T>(entity: T, ...keys: Key[]): Omit<T, Key> {

    const newEntity = JSON.parse(JSON.stringify(entity));

    for (const key of keys) {

        delete newEntity[key];
        
    }

    return newEntity;
}