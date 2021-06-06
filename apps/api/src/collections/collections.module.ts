import { CacheModule, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CollectionsController } from "./collections.controller";
import { CollectionsService } from "./collections.service";
import { Collection } from "@riddea/typeorm";
import { ClientsModule } from "@nestjs/microservices";
import isDocker from "is-docker";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: "BOT",
        options: {
          host: isDocker() ? "bot" : process.env.BOT_SERVICE_HOST ?? "localhost",
          port: Number(process.env.BOT_PORT ?? 3001),
        },
      },
    ]),
    TypeOrmModule.forFeature([Collection]),
    CacheModule.register({
      ttl: process.env.NODE_ENV === "development" ? 5 : 120,
      max: 1000,
    }),
  ],
  controllers: [CollectionsController],
  providers: [CollectionsService],
})
export class CollectionsModule {}
