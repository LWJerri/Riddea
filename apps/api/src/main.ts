import "reflect-metadata";
import findConfig from "find-config";
import dotenv from "dotenv";

dotenv.config({ path: findConfig(".env") });

import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";
import { Logger } from "@nestjs/common";
import cluster from "cluster";
import os from "os";

const logger = new Logger("API");
const PORT = process.env.API_PORT ?? 3000;

async function bootstrap() {
    if (cluster.isMaster) {
        for (let i = 0; i < os.cpus().length; i += 1) {
            const worker = cluster.fork();

            worker.on("exit", (code, signal) => {
                if (code !== 0) {
                    logger.log(signal);
                }
                logger.log(`A worker with ID ${worker.process.pid} died.`);
            });

            worker.on("listening", () => {
                logger.log(`A worker with ID ${worker.process.pid} started to listening.`);
            });
        }
        logger.log(`Runned at ${PORT} port`);
    } else {
        const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(), { logger });
        app.enableCors();
        await app.listen(PORT, "0.0.0.0");
    }
}
bootstrap();
