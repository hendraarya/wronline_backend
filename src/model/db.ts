import { development_nmax, development_mta, development_hris } from "../config/db.config";
const Pool = require("pg").Pool;

export const pool = new Pool({
    user: development_nmax.username,
    host: development_nmax.host,
    database: development_nmax.database,
    password: development_nmax.password,
    port: development_nmax.port,
});

export const poolmta = new Pool({
    user: development_mta.username,
    host: development_mta.host,
    database: development_mta.database,
    password: development_mta.password,
    port: development_mta.port,
});
export const poolhris= new Pool({
    user: development_hris.username,
    host: development_hris.host,
    database: development_hris.database,
    password: development_hris.password,
    port: development_hris.port,
});

//open the Postgres Connection
pool.connect((error:any) => {
    if (error) throw error;
    console.log("Successfully connected to the database NMAX");
});

poolmta.connect((error:any) => {
    if (error) throw error;
    console.log("Successfully connected to the database MTA");
});

poolhris.connect((error:any) => {
    if (error) throw error;
    console.log("Successfully connected to the database Karyawan");
});
