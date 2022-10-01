import { Response, Request } from "express";
import { Validator } from "node-input-validator";
import { validatorErrors, getNikname, getMachinename, setSwr, getPriority } from "../helper/helper";
import { QueryBuilderNmax, queryCustomPgsql } from "../model/model";
import moment from "moment";

//Library Excel
const XlsxPopulate = require('xlsx-populate');



let regisWr: number = 1;
const table: string = "nmax.xwr";

let CellG14: string = "( )";
let CellG15: string = "( )";
let CellG16: string = "( )";
let CellH16: string = "( )";


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
            const getSwr: any = await setSwr(req, res);
            let sectionid: string = getValuanmachinename[1];
            let setPriority: any = [sectionid, stype, surgency];
            const getPriorityMachine: any = await getPriority(req, res, setPriority);

            //start set symbol to Worksheet Excel WR Online
            if (stype === "EMERGENCY STOP") {
                CellG14 = "(O)";
                CellG15 = "( )";
                CellG16 = "( )";
            }
            else if (stype === "MACHINE MULFUNCTION") {
                CellG14 = "( )";
                CellG15 = "(O)";
                CellG16 = "( )";

            }
            else if (stype === "PLAN") {
                CellG14 = "( )";
                CellG15 = "( )";
                CellG16 = "(O)";
                CellH16 = "PLAN";

            }
            else if (stype === "OTHER") {
                CellG14 = "( )";
                CellG15 = "( )";
                CellG16 = "(O)";
                CellH16 = "OTHERS";

            }
            //end set symbol to Worksheet Excel WR Online
            console.log("stype :", stype);

            const attachname: string = `${getSwr}.xlsx`;
            const pathattachname: string = `./src/Excelform/WRonlineexcel/${getSwr}.xlsx`;
            // console.log("Nilai getvalue Machine", getValuanmachinename);
            // Load a new blank workbook
            await XlsxPopulate.fromFileAsync("./src/Excelform/WR.xlsx")
                .then((workbook: any) => {
                    // Modify the workbook.
                    workbook.sheet("Sheet2").cell("I4").value(getSwr);
                    workbook.sheet("Sheet2").cell("C6").value(moment(drepair).format('DD-MM-YYYY'));
                    workbook.sheet("Sheet2").cell("C7").value(trepair);
                    workbook.sheet("Sheet2").cell("C8").value(smach);
                    workbook.sheet("Sheet2").cell("C9").value(getValuanmachinename[0]);
                    workbook.sheet("Sheet2").cell("C10").value(getPriorityMachine[2]);
                    workbook.sheet("Sheet2").cell("F11").value(getValuenik);
                    workbook.sheet("Sheet2").cell("A22").value(sproblem);
                    workbook.sheet("Sheet2").cell("G14").value(CellG14);
                    workbook.sheet("Sheet2").cell("G15").value(CellG15);
                    workbook.sheet("Sheet2").cell("G16").value(CellG16);
                    workbook.sheet("Sheet2").cell("H16").value(CellH16);

                    // Write to file.
                    return workbook.toFileAsync(`./src/Excelform/WRonlineexcel/${getSwr}.xlsx`);
                });


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
                    smachsectname: getPriorityMachine[2],
                    sattach: pathattachname,
                    sattachname: attachname
                };
                await QueryBuilderNmax(table)
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
                    });
            }
        };
    });
};

export const getalldata_wr = async (req: Request, res: Response) => {

    await QueryBuilderNmax(table)
        .select('*')
        .orderBy('dinput', 'DESC')
        .then(async (result: any) => {

            const keyFormat = "YYYY-MM-DD"
            const groupReadings = (readings: any) => {
                const groups: any = []
                readings.forEach((reading: any) => {
                    const dateMoment = moment(reading.dinput)
                    const dateKey = dateMoment.format(keyFormat)

                    let dateData = groups.find((x: any) => x.date === dateKey)
                    if (!dateData) {
                        dateData = {
                            date: dateKey,
                            values: []
                        }
                        groups.push(dateData)
                    }

                    let groupedReading = dateData.values.find((x: any) => x.t === reading.dinput)
                    if (!groupedReading) {
                        groupedReading = {
                            swr: reading.swr,
                            snik: reading.snik,
                            snikname: reading.snikname,
                            smach: reading.smach,
                            smachname: reading.smachname,
                            drepair: reading.drepair,
                            trepair: reading.trepair,
                            sproblem: reading.sproblem,
                            surgency: reading.surgency,
                            dinput: reading.dinput,
                            dupdate: reading.dupdate,
                            spriority: reading.spriority,
                            sstatus: reading.sstatus,
                            sremark: reading.sremark

                        }
                        dateData.values.push(groupedReading)
                    }
                })

                return groups
            }

            const result2 = groupReadings(result)


            return res.send({
                status: "Show Data Success !",
                data: {
                    dataresult: result2
                }
            })


        })
        .catch((err: any) => {
            return res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving data.",
            });
        })

}

export const countdataallwr = async (req: Request, res: Response) => {
    await QueryBuilderNmax(table)
        .count('swr')
        .then(async (result: any) => {
            if (result) {
                return res.send({
                    status: "Show Data Success !",
                    data: result
                })
            }
        })
        .catch((err: any) => {
            return res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving data.",
            });
        })
};

export const countdatawrtoday = async (req: Request, res: Response) => {
    await QueryBuilderNmax(table)
        .whereRaw('date(dinput) = date(now())')
        .count('swr')
        .then(async (result: any) => {
            if (result) {
                return res.send({
                    status: "Show Data Success !",
                    data: result
                })
            }
        })
        .catch((err: any) => {
            return res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving data.",
            });
        })
};