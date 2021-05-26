require("dotenv").config();


const entitiesPath = process.env.NODE_ENV === 'production' 
    ? {
        entities: ["dist/src/entities/**/*.js"],
        migrations: ["dist/src/migrations/**/*.js"],
    } : {
        entities: ["src/entities/**/*.ts"],
        migrations: ["src/migrations/**/*.ts"],
    }

module.exports = {
    type: "postgres",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    synchronize: true,
    logging: false,
    ...entitiesPath,
    cli: {
        entitiesDir: "src/entities",
        migrationsDir: "src/migrations",
    },
};
