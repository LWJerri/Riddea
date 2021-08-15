import "reflect-metadata";
import "source-map-support/register";
import dotenv from "dotenv";
import findConfig from "find-config";

dotenv.config({ path: findConfig(".env") });

import { createConnection, getConnectionOptions } from "typeorm";

import { bootstrap as api } from "./api";
import { bootstrap as bot } from "./bot";
import * as typeormEntitites from "./entities";
import i18n from "./libs/i18n";



async function bootstrap() {
  const connectionOptions = await getConnectionOptions();
  await createConnection(Object.assign(connectionOptions, { entities: Object.values(typeormEntitites) }));
  await i18n.init();
  await bot();
  await api();
}

bootstrap();

function shutDownServices() {
  import("./bot").then((b) => b.bot.stop());
  import("./api").then((a) => a.app.close());

  process.exit(0);
}

process
  .on("SIGINT", () => shutDownServices())
  .on("SIGTERM", () => shutDownServices())
  .on("SIGINT", () => shutDownServices())
  .on("unhandledRejection", (reason) => console.error(reason))
  .on("uncaughtException", (reason) => console.error(reason));
