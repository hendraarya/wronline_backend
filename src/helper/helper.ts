import { rejects } from "assert";
import { Request, Response } from "express";
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
        queryCustomPgsql(querygetNik, [saveGetnik], 'dbHris', (error: any, data: any) => {
            if (error) {
                return res.status(500).send({
                    message: error.message || "NIK tidak ada.",
                });
            } else {
                resolve(data.rows);
            }

            //  return res.send({
            //         status: "success",
            //         code: 200,
            //         message: "data nik berhasil diget22",
            //         data: data.rows,

            //     });
        });
    });
};

export const getMachinename = (req:Request, res:Response, machineid: string) => {
    return new Promise((resolve,rejects) => {
        let saveGetmachinename = machineid;
        const queryMachine: string = 'SELECT strdescription from mta.mmachine WHERE machid = $1';
        queryCustomPgsql(queryMachine, [saveGetmachinename], 'dbMta', (error:any, data:any) => {
            if(error){
                return res.status(500).send({
                    message: error.message || "Machine ID ini tidak ada",
                });
            }
            else{
                if(data.length !== 0)
                {
                    resolve(data.rows)
                }
                else {
                    return res.status(500).send({
                        message: error.message || "Machine ID ini tidak ada",
                    });
                }
                
            }
        });
    });
};