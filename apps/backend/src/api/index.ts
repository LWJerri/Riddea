import fastifySession from "@mgcrea/fastify-session";
import { Logger, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import fastifyCookie from "fastify-cookie";

import { AppModule } from "./app.module";
import { TypeormStore } from "./libs/SessionStore";

export const apiLogger = new Logger("API");
const PORT = process.env.API_PORT ?? 3000;
export let app: NestFastifyApplication;

export async function bootstrap() {
  try {
    app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(), { logger: apiLogger });
    app.register(fastifyCookie);
    app.register(fastifySession, {
      secret:
        process.env.WEB_SESSION_SECRET ||
        Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
      saveUninitialized: false,
      cookie: {
        maxAge: 864e3, // 1 day
      },
      store: new TypeormStore(),
    });
    app.enableCors({
      /* origin: [
      'http://localhost:4000',
      'https://riddea.ml'
    ],
    credentials: true, */
    });
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    const config = new DocumentBuilder()
      .setTitle("Riddea API")
      .setDescription("Avaliable Riddea API endpoints")
      .setVersion("1.0")
      .addTag("v1")
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("/", app, document, {
      customSiteTitle: "Riddea API Docs",
    });

    await app.listen(PORT, "0.0.0.0");
    apiLogger.log(`Listening on ${PORT}`);
  } catch (err) {
    apiLogger.error(`API main error`, err.stack);
  }
}
