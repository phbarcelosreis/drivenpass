import { Router } from "express";
import credentialsRouter from "./credential-router";
import userRouter from "./users-router";
import networkRouter from "./wifi-router";

const router = Router();

router
    .use(userRouter)
    .use(credentialsRouter)
    .use(networkRouter)

export default router;