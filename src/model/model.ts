import {pool,poolhris,poolmta} from "./db";

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