import { development } from "../config/db.config";
const Pool = require("pg").Pool;

export const pool = new Pool({
    user: development.username,
    host: development.host,
    database: development.database,
    password: development.password,
    port: development.port,
});

//open the Postgres Connection
pool.connect((error:any) => {
    if (error) throw error;
    console.log("Successfully connected to the database");
});
