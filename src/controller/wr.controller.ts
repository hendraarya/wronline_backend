import {Response, Request} from "express";
import { Validator } from "node-input-validator";

export const add_wr = (req:Request, res:Response) => {
    const validator = new Validator(req.body, {
        snik: "required|string",
        snikname: "required|string",
        smach: "required|string",
        smachname: "required|string",
        drepair: "required|dateFormat: YYYY-MM-DD",
        trepair: "required",
        sproblem: "required|string",
        stype: "required|string",
        surgency: "required|string"
    });

    validator.check().then(async(matched:boolean) => {
        if(!matched){}
    })
};