import {pool,poolhris,poolmta} from "./db";
import knex, {Knex} from "knex";
import { development_nmax, development_hris, development_mta } from "../config/db.config";

// Start if use Query Basic
export const queryCustomPgsql = (customQuery: string, param:any,switchquery:any,result: any) => {
    if(switchquery == 'dbNmax')
    {
    pool.query(customQuery, param,(err: any,res: any) => {
        if(err){
            console.log("error:", err);
            result(err,null);
            return;
        }
        result(null,res);
    });
}
  else if (switchquery == 'dbMta')
  {
    poolmta.query(customQuery, param,(err: any,res: any) => {
        if(err){
            console.log("error:", err);
            result(err,null);
            return;
        }
        result(null,res);
    });
  }
  else if (switchquery == 'dbHris')
  {
    poolhris.query(customQuery, param,(err: any,res: any) => {
        if(err){
            console.log("error:", err);
            result(err,null);
            return;
        }
        result(null,res);
    });
  }
};
// End if use Query Basic

// Start if use QueryBuilder
export const QueryBuilderNmax: Knex = knex({
    client: "pg",
    connection: {
        host: development_nmax.host,
        port: development_nmax.port,
        user: development_nmax.username,
        password: development_nmax.password,
        database: development_nmax.database,

    },
});

export const QueryBuilderMta: Knex = knex({
    client: "pg",
    connection: {
        host: development_mta.host,
        port: development_mta.port,
        user: development_mta.username,
        password: development_mta.password,
        database: development_mta.database,

    },
});

export const QueryBuilderHris: Knex = knex({
    client: "pg",
    connection: {
        host: development_hris.host,
        port: development_hris.port,
        user: development_hris.username,
        password: development_hris.password,
        database: development_hris.database,

    },
});
// End if use QueryBuilder