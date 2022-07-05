const Pool = require("pg").Pool;
const pool = new Pool({
    user: 'postgres',
    host: '10.202.10.77',
    database: 'nmax',
    password: 'postgres',
    port: 5432
});

const getmesin = (req:any, res:any) => {
    pool.query('SELECT * FROM nmax.users', (error : any, results: any) => {
        if (error) {
            throw error
        }
        return res.send({
            status: "success",
            code : 200,
            message : "Data successfully Show!",
            data : results.rows,

        });
    })
}

module.exports = {
    getmesin
}