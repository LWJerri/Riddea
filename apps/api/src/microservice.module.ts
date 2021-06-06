import { Global, Module } from "@nestjs/common";
import { ClientsModule } from "@nestjs/microservices";
import isDocker from "is-docker";

const name = "BOT_SERVICE";

const microserviceModule = ClientsModule.register([
  {
    name,
    options: {
      host: isDocker() ? "bot" : process.env.BOT_SERVICE_HOST ?? "localhost",
      port: Number(process.env.BOT_PORT ?? 3001),
    },
  },
]);

@Global()
@Module({
  imports: [microserviceModule],
  exports: [microserviceModule, ClientsModule],
})
export class MicroserviceModule {}
