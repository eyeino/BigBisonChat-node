const { Pool } = require('pg');
const { CONSTANTS } = require('./constants');

let pool = new Pool({
    database: 'postgres'
});

pool.query(`DROP DATABASE IF EXISTS ${CONSTANTS.DATABASE}`, (err, res) => {
    if (res) {
        console.log('database dropped');
    }
});