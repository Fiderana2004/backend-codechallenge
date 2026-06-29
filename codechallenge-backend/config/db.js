const { Pool } = require("pg");

const pool = new Pool({
    user: "codechallenge_0b70_user",
    host: "localhost",
    database: "codechallenge",
    password: "wcuQjzlEWx79WK8OV2ka5nbLIo5hAr6Y",
    port: 5432
});

module.exports = pool;
