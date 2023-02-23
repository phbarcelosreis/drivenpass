import { Router } from "express";
import { teste, userPostSignIn, userPostSignUp } from "../controllers/user-controller.js";

const userRouter = Router();

userRouter
    .post("/sign-in", userPostSignIn)
    .post("/sign-up", userPostSignUp)
    .get("/teste", teste)

export { userRouter };