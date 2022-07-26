import {Response, Request} from "express";
import { Validator } from "node-input-validator";
import { validatorErrors, getNikname, getMachinename, setSwr, getPriority} from "../helper/helper";
import { QueryBuilderNmax} from "../model/model";
import moment from "moment";

let regisWr: number = 1;
const table: string = "nmax.xwr";

export const add_wr = (req: Request, res: Response) => {
    const validator = new Validator(req.body, {
        snik: "required|string",
        smach: "required|string",
        drepair: "required|dateFormat:YYYY-MM-DD",
        trepair: "required",
        sproblem: "required|string",
        stype: "required|string",
    });


    validator.check().then(async (matched: boolean) => {
        if (!matched) {
            validatorErrors(req, res, validator);
        } else {
            let {
                snik,
                smach,
                drepair,
                trepair,
                sproblem,
                stype,
                surgency

            } = req.body;
            const getValuenik: any = await getNikname(req, res, snik);
            const getValuanmachinename: any = await getMachinename(req, res, smach);
            const getSwr: any = await setSwr(req,res);
            let sectionid: string =  getValuanmachinename[1];
            let setPriority: any = [sectionid, stype, surgency];
            const getPriorityMachine: any = await getPriority(req,res, setPriority);
            // console.log("Nilai getvalue Machine", getValuanmachinename);

            if (!getValuanmachinename[0] || !getValuenik) {
                // console.log("Nilai:", [getValuenik, getValuanmachinename]);
                return res.status(409).send({
                    status: "Not Found",
                    message: "NIK or Machine not Available, teliti kembali!"
                });

            } else {
                // const Tgl = moment(new Date()).format('DD-MM-YYYY');
                const dateTimeNow = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
                // const convertRegis = String(regisWr).padStart(2, '0');
                // const sWrn = "WR" + Tgl.toString().substring(8, 10) + Tgl.toString().substring(3, 5) + Tgl.toString().substring(0, 2) + "-" + convertRegis;
                // console.log("Tanggal Sekarang :", [sWrn, Tgl, getSwr]);
                console.log("getSwrDb:", [getSwr]);
                const columnToInsert = {
                    swr: getSwr,
                    snik: snik,
                    snikname: getValuenik,
                    smach: smach,
                    smachname: getValuanmachinename[0],
                    drepair: drepair,
                    trepair: trepair,
                    sproblem: sproblem,
                    stype: stype,
                    surgency: surgency,
                    dinput: dateTimeNow,
                    dupdate: dateTimeNow,
                    spriority: getPriorityMachine[0],
                    smachsect: getPriorityMachine[1],
                    smachsectname: getPriorityMachine[2]
                };
                QueryBuilderNmax(table)
                    .insert(columnToInsert)
                    .then((result: any) => {
                        regisWr = regisWr + 1;
                        return res.send({
                            status: "Success",
                            message: "Add Data Successfully!"
                        });

                    })
                    .catch((err: any) => {
                        return res.status(500).send({
                            message: err.message,
                        });
                    })
            }
        };
    });
};