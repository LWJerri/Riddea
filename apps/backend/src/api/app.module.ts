import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { getConnectionOptions } from "typeorm";

import * as typeOrmEntities from "../entities";
import { AuthModule } from "./auth/auth.module";
import { TelegramModule } from "./auth/telegram/telegram.module";
import { CollectionsModule } from "./collections/collections.module";
import { StatsModule } from "./stats/stats.module";
import { UsersModule } from "./users/users.module";

@Module({
  imports: [
    CollectionsModule,
    TypeOrmModule.forRootAsync({
      useFactory: async () => {
        return Object.assign(await getConnectionOptions(), {
          name: "api",
          entities: Object.values(typeOrmEntities),
        });
      },
    }),
    UsersModule,
    StatsModule,
    TelegramModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
