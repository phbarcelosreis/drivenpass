import { createNetwork, deleteNetwork, getNetwork } from "../controllers/network-controller";
import { Router } from "express";
import { checkToken } from "../middleware/authentication-middleware";

const networkRouter = Router();

networkRouter
    .all("/*", checkToken)
    .post("/create-network", createNetwork)
    .get("/network", getNetwork)
    .delete("/network", deleteNetwork )

export default networkRouter;