import express, { Express, Router, Response, Request } from "express";
import * as auth from "../controller/auth.controller.js";
import * as wronline from "../controller/wr.controller.js";

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

router.post("/login", auth.login);
router.post("/getnikname", wronline.add_wr);
router.get("/mesin", db.getmesin);
router.get("/countdataallwr", wronline.countdataallwr);
router.get("/countdatawrtoday", wronline.countdatawrtoday);
router.get("/getalldata_wr/:limit", wronline.getalldata_wr);
router.get("/searchdatawr/:drepair", wronline.searchdatawr);
router.get("/getcountallstatuswr", wronline.getcountallstatuswr);