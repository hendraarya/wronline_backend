import {Response, Request} from "express";
import { Validator } from "node-input-validator";
import { validatorErrors, getNikname, getMachinename } from "../helper/helper";
import { queryCustomPgsql } from "../model/model";

export const add_wr = (req: Request, res: Response) => {
    const validator = new Validator(req.body, {
        snik: "required|string",
        // snikname: "required|string",
        smach: "required|string",
        // smachname: "required|string",
        // drepair: "required|dateFormat: YYYY-MM-DD",
        // trepair: "required",
        // sproblem: "required|string",
        // stype: "required|string",
        // surgency: "required|string"
    });

    validator.check().then(async (matched: boolean) => {
        if (!matched) {
            validatorErrors(req, res, validator);
        } else {
            let {
                snik,
                smach,

            }= req.body;
            const getValuenik:any = await getNikname(req,res, snik);
            const getValuanmachinename: any = await getMachinename(req,res,smach);
            // const getValuemachinename: any = await getNikname(req,res, smach);
            // let queryGetnikname = 'SELECT strname from synchris.mempdata WHERE strprno = $1';
            // let queryGetmachinename = 'SELECT strdescription from mta.mmachine WHERE machid = $2';
            // let getNikname = req.body.snik;
            // let getMachinename = req.body.smach;

            // queryCustomPgsql(queryGetnikname, [getNikname], 'dbHris', (err: any, data: any) => {
            //     return res.send({
            //         status: "success",
            //         code: 200,
            //         message: "data nik berhasil diget",
            //         data: data.rows,

            //     });

            // });
            console.log("Nilai:",[getValuenik, getValuanmachinename]);
            if(!getValuanmachinename) {
                return res.status(409).send({
                    status: "Not Found",
                    message: "Machine tidak ada, teliti kembali!"
                });
                
            }
            else {
                // console.log("Nilai:",[getValuenik, getValuanmachinename]);
                return res.status(200).send({
                    status: "Success",
                    message: "Machine Ada"
                });
                
            }
            

        }



    })
};