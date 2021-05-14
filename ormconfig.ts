require("dotenv").config();

module.exports = {
    type: "postgres",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    synchronize: true,
    logging: false,
    entities: ["dist/src/entities/**/*.js"],
    migrations: ["dist/src/migrations/**/*.js"],
    cli: {
        entitiesDir: "src/entities",
        migrationsDir: "src/migrations",
    },
    ssl: {
        rejectUnauthorized: false,
    },
};
