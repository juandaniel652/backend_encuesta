import mysql from "mysql2/promise";

export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});

//Para poner en Render: 

//DB_HOST=ip_o_host_db_cliente
//DB_USER=usuario_produccion
//DB_PASSWORD=****
//DB_NAME=base_produccion
