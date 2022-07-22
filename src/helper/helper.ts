import { Request, Response } from "express";
import { queryCustomPgsql } from "../model/model";
import moment from "moment";


export const validatorErrors = (req: Request, res: Response, validator: any) => {
    let error_message: Array < String > = [];
    for (const key of Object.keys(validator.errors)) {
        error_message.push(validator.errors[key].message);
    }

    res.status(422).send({
        status: "warning",
        error_message: error_message
    });
};

export const getNikname = (req: Request, res: Response, nik: string) => {
    return new Promise((resolve) => {
        let saveGetnik = nik;
        const querygetNik: string = 'SELECT strname from synchris.mempdata WHERE strprno = $1';
        queryCustomPgsql(querygetNik, [saveGetnik], 'dbHris', (err: any, data: any) => {
            if (err) {
                return res.status(500).send({
                    message: err.message || "NIK tidak ada.",
                });
            } else {
                if(data.rows.length !== 0){
                    resolve(data.rows[0].strname);
                } 
                else {
                    resolve(false);
                }
                
            }
        });
    });
};

export const getMachinename = (req: Request, res: Response, machineid: string) => {
    return new Promise((resolve, rejects) => {
        let saveGetmachinename = machineid;
        const queryMachine: string = 'SELECT strdescription from mta.mmachine WHERE machid = $1';
        queryCustomPgsql(queryMachine, [saveGetmachinename], 'dbMta', (error: any, data: any) => {
            if (error) {
                return res.status(500).send({
                    message: error.message || "Machine ID ini tidak ada",
                });
            } else {
                if (data.rows.length !== 0) {
                    console.log(data.rows[0].strdescription);
                    resolve(data.rows[0].strdescription);
                } else {
                    console.log(data.rows);
                    resolve(false);
                }

            }
        });
    });
};

export const setSwr = async (req: Request, res: Response) => {
    return new Promise((resolve) => {
        const queryNmax: string = 'select swr, dinput from nmax.xwr order by dinput desc limit 1';
        queryCustomPgsql(queryNmax, [], 'dbNmax', (error: any, data: any) => {
            if (error) {
                return res.status(500).send({
                    message: error.message || "Syntax PGSQL Error!"
                });
            } else {
                if (data.rows.length !== 0) {
                    const Tgl = moment(new Date()).format('YYYY-MM-DD');
                    const nextdate = moment(data.rows[0].dinput).format('YYYY-MM-DD');
                    const resetWr: boolean = moment(Tgl).isSame( nextdate) ? true : false;
                    if (resetWr) {
                        console.log([data.rows[0].swr, nextdate, Tgl]);
                        let newSwr: string = data.rows[0].swr.toString().substring(9, 11); // get value dari array No 9 sampai sebelum array No 11
                        let newSwr2: number = parseInt(newSwr) + 1; //convert dari String to Integer
                        const convertRegis = String(newSwr2).padStart(2, '0'); // Add 0, jika number dibawah 2 digit
                        const sWrn = "WR" + Tgl.toString().substring(8, 10) + Tgl.toString().substring(3, 5) + Tgl.toString().substring(0, 2) + "-" + convertRegis;
                        resolve(sWrn);
                    } else {
                        console.log([data.rows[0].swr, nextdate, Tgl]);
                        const newSwr3 = String(1).padStart(2, '0');
                        const sWrn = "WR" + Tgl.toString().substring(8, 10) + Tgl.toString().substring(3, 5) + Tgl.toString().substring(0, 2) + "-" + newSwr3;
                        resolve(sWrn);
                    }

                } else {
                    resolve(false);
                }
            }
        });
    });

};
