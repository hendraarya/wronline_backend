import express, { Express, Router, Response, Request } from "express";
import * as auth from "../controller/auth.controller.js";

const db = require('../queries');

export const route: Express = express();
const router = Router();

route.use("/api/", router);
route.use((req: Request, res: Response) => {
    res.status(404).send({
        status: "error",
        message: "Route not Found!",
    });
});

router.post("/login", auth.login );
router.get("/mesin", db.getmesin);