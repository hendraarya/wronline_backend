import {pool,poolmta} from "./db";

export const queryCustomPgsql = (customQuery: string, param:any,switchquery:any,result: any) => {
    if(switchquery == 1)
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
  else if (switchquery == 2)
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
};