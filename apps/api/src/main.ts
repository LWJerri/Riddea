import "reflect-metadata";
import "source-map-support/register";

import findConfig from "find-config";
import dotenv from "dotenv";

dotenv.config({ path: findConfig(".env") });

import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";
import { Logger, ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

const logger = new Logger("API");
const PORT = process.env.API_PORT ?? 3000;

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(), { logger });
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  const config = new DocumentBuilder()
    .setTitle("Riddea API")
    .setDescription("Avaliable Riddea api endpoints")
    .setVersion("1.0")

    .addTag("v1")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("/", app, document, {
    customSiteTitle: "Riddea API Docs",
  });
  await app.listen(PORT, "0.0.0.0");
}
bootstrap();
