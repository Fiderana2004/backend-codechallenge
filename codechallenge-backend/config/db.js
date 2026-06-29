const { Pool } = require("pg");

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "codechallenge",
    password: "Fiderana04",
    port: 5432
});

module.exports = pool;