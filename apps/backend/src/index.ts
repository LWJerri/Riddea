import "reflect-metadata";
import "source-map-support/register";
import findConfig from "find-config";
import dotenv from "dotenv";

dotenv.config({ path: findConfig(".env") });

import { bootstrap as bot } from './bot'
import { bootstrap as api } from './api'
import { createConnection, getConnectionOptions } from "typeorm";

import * as typeormEntitites from './entities'

async function bootstrap() {
  const connectionOptions = await getConnectionOptions();
  await createConnection(Object.assign(connectionOptions, { entities: Object.values(typeormEntitites) }));

  await bot()
  await api()
}

bootstrap()

function shutDownServices() {
  import('./bot').then(b => b.bot.stop())
  import('./api').then(a => a.app.close())

  process.exit(0);
}

process
  .on("SIGINT", () => shutDownServices())
  .on("SIGTERM", () => shutDownServices())
  .on('SIGINT', () => shutDownServices())
  .on("unhandledRejection", (reason) => console.error(reason))
  .on("uncaughtException", (reason) => console.error(reason))
