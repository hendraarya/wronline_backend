type DatabaseConfig = {
  username: string;
  password: string;
  database: string;
  host: string;
  port: number;
  dialect: string;
};

export const production: DatabaseConfig = {
  username: "root",
  password: "#NOh4cking",
  database: "causedb",
  host: "localhost",
  port: 3306,
  dialect: "mysql",
};

export const development: DatabaseConfig = {
  username: "postgres",
  password: "postgres",
  database: "nmax",
  host: "10.202.10.77",
  port: 5432,
  dialect: "pgsql",
};