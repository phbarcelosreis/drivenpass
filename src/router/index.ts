import { Router } from "express";
import { userRouter } from "./users-router.js";

const router = Router();

router.use(userRouter);

export { router }