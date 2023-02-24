import { Router } from "express";
import { userPostSignIn, userPostSignUp } from "../controllers/user-controller";

const userRouter = Router();

userRouter
    .post("/sign-in", userPostSignIn)
    .post("/sign-up", userPostSignUp)

export default userRouter;