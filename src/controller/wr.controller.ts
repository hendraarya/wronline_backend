import { Response, Request } from "express";
import { Validator } from "node-input-validator";
import { validatorErrors, getNikname, getMachinename, setSwr, getPriority } from "../helper/helper";
import { QueryBuilderNmax } from "../model/model";
import moment from "moment";

//Library Excel
const XlsxPopulate = require('xlsx-populate');
var fs = require('fs');


var nodemailer = require('nodemailer');

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
            const getSwr: any = await setSwr(req, res);
            let sectionid: string = getValuanmachinename[1];
            let setPriority: any = [sectionid, stype, surgency];
            const getPriorityMachine: any = await getPriority(req, res, setPriority);
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


                const XlsxPopulate = require('xlsx-populate');

                // Load a new blank workbook
                await XlsxPopulate.fromFileAsync("./WR.xlsx")
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

                        // Write to file.
                        return workbook.toFileAsync(`./${getSwr}.xlsx`);
                    });


                // start send email to gmail

                // let transport = nodemailer.createTransport({
                //     host: "smtp.gmail.com",
                //     port: 465,
                //     secure: true,
                //     auth: {
                //         user: "hendraarya.nin@gmail.com",
                //         pass: "nin118208"
                //     },
                //     debug: true,
                //     logger: true
                // });

                // let scrapeEmailMessage = {
                //     //from: 'myemail@gmail.com',
                //     to: 'hendra@nok.co.id',
                //     subject: 'Hello World',
                //     text: 'hello world'
                // };


                // transport.sendMail(scrapeEmailMessage, function(err: any, data: any) {
                //     if(err) {
                //         console.log(err);
                //     } else {
                //         console.log('Email sent successfully');
                //     }
                // });
                // End send email to gmai
            }
        };
    });
};