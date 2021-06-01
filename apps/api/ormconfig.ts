require("dotenv").config();
const { resolve } = require("path");
const typeormEntities = require("@riddea/typeorm");

const options = {
    type: "postgres",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    synchronize: false,
    entities: Object.values(typeormEntities),
    logging: process.env.NODE_ENV === "development",
    cli: {
        entitiesDir: resolve(process.cwd(), "..", "..", "packages/typeorm/src/entities"),
        migrationsDir: resolve(process.cwd(), "..", "..", "packages/typeorm/src/migrations"),
    },
};

module.exports = options;
