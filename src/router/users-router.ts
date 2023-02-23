import { Router } from "express";
import { userGet, userPost } from "../controllers/user-controller.js";

const userRouter = Router();

userRouter
    .get("/users", userGet)
    .post("/users", userPost)

export { userRouter };