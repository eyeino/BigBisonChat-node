const { Pool } = require('pg');
const {
    CONSTANTS,
    initDatabase,
    initUsers,
    initMessages
} = require('./constants');

try {
    let pool = new Pool({
        database: 'postgres'
    });

    initDatabase(pool, () => {
        const newPool = new Pool({
            database: CONSTANTS.DATABASE
        });

        initUsers(newPool);
        initMessages(newPool);
    });
} catch(err) {
    console.log(err.code)
}