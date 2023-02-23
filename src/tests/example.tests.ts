import { init } from "../app.js";
import { cleanDb } from "./helpers.js";



beforeAll(async () => {
    await init();
    await cleanDb();
});
