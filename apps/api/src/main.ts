import "reflect-metadata";
import "source-map-support/register";

import findConfig from "find-config";
import dotenv from "dotenv";

dotenv.config({ path: findConfig(".env") });

import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";
import { Logger } from "@nestjs/common";

const logger = new Logger("API");
const PORT = process.env.API_PORT ?? 3000;

async function bootstrap() {
    const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(), { logger });
    app.enableCors();
    await app.listen(PORT, "0.0.0.0");
}
bootstrap();
