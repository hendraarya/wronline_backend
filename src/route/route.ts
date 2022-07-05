import express, { Express, Router, Response, Request } from "express";

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

router.get("/mesin", db.getmesin);