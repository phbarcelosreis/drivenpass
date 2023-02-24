import { Router } from "express";
import userRouter from "./users-router";

const router = Router();

router.use(userRouter);

export default router;