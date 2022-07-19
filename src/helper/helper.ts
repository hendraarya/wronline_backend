import { Request, Response } from "express";
import { resolve } from "path";
import { queryCustomPgsql } from "../model/model";


export const validatorErrors = (req: Request, res: Response, validator: any) => {
    let error_message: Array < String > = [];
    for (const key of Object.keys(validator.errors)) {
        error_message.push(validator.errors[key].message);
    }

    res.status(422).send({
        status: "waarning",
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

export const findSubstr = (getId: any) => {
    return new Promise((resolve) => {
        var nilai = getId;
        var stringdate = String(nilai).substring(0,2);
        resolve(stringdate);

    });
}