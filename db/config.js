const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool(
    {
        // TODO: Enter PostgreSQL username
        user: process.env.DB_USER,
        // TODO: Enter PostgreSQL password
        password: process.env.DB_PASSWORD,
        host: 'localhost',
        // TODO: Enter PostgreSQL db_name
        database: process.env.DB_NAME
    },
)



module.exports = pool;