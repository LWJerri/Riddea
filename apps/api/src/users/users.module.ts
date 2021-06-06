import { CacheModule, Module } from "@nestjs/common";
import { ClientsModule } from "@nestjs/microservices";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Collection } from "@riddea/typeorm";
import isDocker from "is-docker";
import { CollectionsService } from "../collections/collections.service";
import { UsersController } from "./users.controller";

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
  controllers: [UsersController],
  providers: [CollectionsService],
})
export class UsersModule {}
