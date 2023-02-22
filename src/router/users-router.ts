import { Router } from "express";
import { userGet } from "../controllers/user-controller.js";

const userRouter = Router();

userRouter.get("/users", userGet);

export { userRouter };