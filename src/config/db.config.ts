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

export const development_nmax: DatabaseConfig = {
  username: "hendra",
  password: "hendra-118208",
  database: "nmax",
  host: "10.202.10.111",
  port: 5432,
  dialect: "pgsql",
};

export const development_mta: DatabaseConfig = {
  username: "postgres",
  password: "postgres",
  database: "mta",
  host: "10.202.10.199",
  port: 5432,
  dialect: "pgsql",
};

export const development_hris: DatabaseConfig = {
  username: "postgres",
  password: "postgres",
  database: "appmhris",
  host: "10.202.10.199",
  port: 5432,
  dialect: "pgsql",
};