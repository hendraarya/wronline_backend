import { development_nmax, development_mta } from "../config/db.config";
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

//open the Postgres Connection
pool.connect((error:any) => {
    if (error) throw error;
    console.log("Successfully connected to the database NMAX");
});

poolmta.connect((error:any) => {
    if (error) throw error;
    console.log("Successfully connected to the database MTA");
});
