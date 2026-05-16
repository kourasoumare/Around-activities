import dotenv from 'dotenv'; 
dotenv.config();

import pkg from 'pg'; // Importing the 'pg' package to interact with PostgreSQL databases
const { Pool } = pkg;

const pool = new Pool({  
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
})// Creating a new connection pool to the PostgreSQL database using environment variables for configuration

export default pool