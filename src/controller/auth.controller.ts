import { Request, Response } from "express";
import { Validator } from "node-input-validator";
import {pool} from "../model/db.js";

export const login = async (req: Request, res: Response) => {

    const v = new Validator(req.body, {
        username2: 'required|string',
        password4: 'required'
    });

    v.check().then((matched) => {
        if (!matched) {
            res.status(422).send(v.errors);
            return 0;
        }

        let query2 = 'SELECT * FROM nmax.muser where suser =$1 and spasswd = $2';
        let username3 = req.body.username2;
        let password3 = req.body.password4;

        pool.query(query2, [username3, password3], (error: any, results: any) => {
            if (results.rowCount == 0) {
                return res.send({
                    status: "No Matched",
                    message: "Username or password not correct,please check again!",

                });
            }
            return res.send({
                status: "success",
                code: 200,
                message: "user has successfully login!",
                // data : results.rows,

            });
        });

    });
    console.log([req.body.username2, req.body.password4]);
};