import prisma from "../../src/database/index";
import { createUser } from "../factories/users-factory";
import { Session } from "@prisma/client";

export async function createSession(token: string): Promise<Session> {
    const user = await createUser();
  
    return prisma.session.create({
      data: {
        token: token,
        userId: user.id,
      },
    });
  }