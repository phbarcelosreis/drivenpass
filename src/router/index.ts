import { Router } from "express";
import credentialsRouter from "./credential-router";
import userRouter from "./users-router";

const router = Router();

router
    .use(userRouter)
    .use(credentialsRouter)

export default router;