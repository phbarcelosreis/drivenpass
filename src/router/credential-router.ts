import { createCredential, deleteCredential, getCredential } from "../controllers/credential-controller";
import { Router } from "express";
import { checkToken } from "../middleware/authentication-middleware";

const credentialsRouter = Router();

credentialsRouter
    .all("/*", checkToken)
    .post("/create-credentials", createCredential)
    .get("/credentials", getCredential)
    .delete("/credentials", deleteCredential)

export default credentialsRouter;