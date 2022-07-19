import {Response, Request} from "express";
import { Validator } from "node-input-validator";
import { validatorErrors, getNikname, getMachinename, findSubstr } from "../helper/helper";
import { QueryBuilderNmax} from "../model/model";

// const Tgl: any = new Date();
// const sWrn: string = "WR-"+Tgl.substring(1,2)+ Tgl.substring(4,5);
function padTo2Digits(num:any) {
    return num.toString().padStart(2, '0');
  }
  
  function formatDate(date:any) {
    return [
      padTo2Digits(date.getDate()),
      padTo2Digits(date.getMonth() + 1),
      date.getFullYear(),
    ].join('/');
  }
  
  const Tgl = formatDate(new Date());
  const date1 = Tgl.toString().substring(0,2);
const table: string = "nmax.xwr";

export const add_wr = (req: Request, res: Response) => {
    const validator = new Validator(req.body, {
        snik: "required|string",
        // snikname: "required|string",
        smach: "required|string",
        // smachname: "required|string",
        drepair: "required|dateFormat:YYYY-MM-DD",
        trepair: "required",
        sproblem: "required|string",
        stype: "required|string",
        surgency: "required|string"
    });

    console.log("Tanggal Sekarang :",[date1,Tgl]);
    validator.check().then(async (matched: boolean) => {
        if (!matched) {
            validatorErrors(req, res, validator);
        } else {
            let {
                swr,
                snik,
                smach,
                drepair,
                trepair,
                sproblem,
                stype,
                surgency

            } = req.body;
            // const getId: any = await findSubstr(Tgl);
            const getValuenik: any = await getNikname(req, res, snik);
            const getValuanmachinename: any = await getMachinename(req, res, smach);
            //console.log("Nilai Tgl:",getId);

            if (!getValuanmachinename || !getValuenik) {
                // console.log("Nilai:", [getValuenik, getValuanmachinename]);
                return res.status(409).send({
                    status: "Not Found",
                    message: "NIK or Machine not Available, teliti kembali!"
                });

            } else {
                console.log(Date)
                const columnToInsert = {
                    swr: swr,
                    snik: snik,
                    snikname: getValuenik,
                    smach: smach,
                    smachname: getValuanmachinename,
                    drepair: drepair,
                    trepair: trepair,
                    sproblem: sproblem,
                    stype: stype,
                    surgency: surgency
                };
                QueryBuilderNmax(table)
                    .insert(columnToInsert)
                    .then((result: any) => {
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