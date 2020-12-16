const CONSTANTS = {
    SCHEMA: {
        PUBLIC: 'public'
    },
    TABLE: {
        USERS: 'users',
        MESSAGES: 'messages',
    },
    DATABASE: 'bigbisonchat_test'
}

const databaseExistsQuery = `
    SELECT EXISTS (
        SELECT datname FROM pg_catalog.pg_database WHERE lower(datname) = lower($1)
    );
`;

const createDatabaseQuery = `
    CREATE DATABASE ${CONSTANTS.DATABASE}
        WITH 
        ENCODING = 'UTF8'
        LC_COLLATE = 'en_US.UTF-8'
        LC_CTYPE = 'en_US.UTF-8'
        TABLESPACE = pg_default
        CONNECTION LIMIT = -1;
`;

const tableExistsQuery = `
    SELECT EXISTS (
        SELECT *
        FROM information_schema.tables
        WHERE
            table_schema = $1 AND
            table_name = $2
    );
`;

const createUsersSequenceQuery = `
    CREATE SEQUENCE public.users_user_id_seq
        INCREMENT 1
        START 1
        MINVALUE 1
        MAXVALUE 2147483647
        CACHE 1;
`;

const createUsersTableQuery = `
    CREATE TABLE public.users
    (
        avatar_url character varying(50) COLLATE pg_catalog."default",
        created_at timestamp with time zone default current_timestamp(2),
        email character varying(50) COLLATE pg_catalog."default" NOT NULL,
        first_name character varying(30) COLLATE pg_catalog."default",
        last_name character varying(30) COLLATE pg_catalog."default",
        open_id_sub character varying(20) COLLATE pg_catalog."default" NOT NULL,
        user_id integer NOT NULL DEFAULT nextval('users_user_id_seq'::regclass),
        username character varying(30) COLLATE pg_catalog."default" NOT NULL,
        CONSTRAINT users_pkey PRIMARY KEY (user_id)
    );
`;

const createMessagesSequenceQuery = `
    CREATE SEQUENCE public.messages_message_id_seq
        INCREMENT 1
        START 1
        MINVALUE 1
        MAXVALUE 2147483647
        CACHE 1;
`;

const createMessagesTableQuery = `
    CREATE TABLE public.messages
    (
        message_id bigint NOT NULL DEFAULT nextval('messages_message_id_seq'::regclass),
        recipient integer NOT NULL,
        sender integer NOT NULL,
        body character varying(1000) COLLATE pg_catalog."default" NOT NULL,
        created_at timestamp with time zone default current_timestamp(2),
        CONSTRAINT messages_pkey PRIMARY KEY (message_id)
    )
`;

const initDatabase = (pool, callback) => pool.query(
    databaseExistsQuery, [CONSTANTS.DATABASE], (err, res) => {
        if (res) {
            const { exists } = res.rows.find(obj => Object.keys(obj).includes('exists'));
            
            if (!exists) {
                pool.query(createDatabaseQuery, (err, res) => {
                    console.log('created database');
                    callback();
                });
            } else {
                console.log('database exists');
                callback();
            }
        }
    }
)

const initUsers = pool => pool.query(
    tableExistsQuery, [CONSTANTS.SCHEMA.PUBLIC, CONSTANTS.TABLE.USERS], async (err, res) => {
        if (res) {
            const { exists } = res.rows.find(obj => Object.keys(obj).includes('exists'));
            
            if (!exists) {
                await pool.query(createUsersSequenceQuery);
                await pool.query(createUsersTableQuery);
                console.log('users table initialized');
            } else {
                console.log('users table exists')
            }
        }
    }
);

const initMessages = pool => pool.query(
    tableExistsQuery, [CONSTANTS.SCHEMA.PUBLIC, CONSTANTS.TABLE.MESSAGES], async (err, res) => {
        if (res) {
            const { exists } = res.rows.find(obj => Object.keys(obj).includes('exists'));
            
            if (!exists) {
                await pool.query(createMessagesSequenceQuery);
                await pool.query(createMessagesTableQuery);
                console.log('messages table initialized');
            } else {
                console.log('messages table exists')
            }
        }
    }
);

module.exports = {
    CONSTANTS,
    initDatabase,
    initUsers,
    initMessages
}