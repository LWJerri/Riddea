import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CollectionsModule } from "./collections/collections.module";
import { UsersModule } from "./users/users.module";
import { StatsModule } from "./stats/stats.module";
import { getConnectionOptions } from "typeorm";
import { TelegramModule } from "./auth/telegram/telegram.module";
import { AuthModule } from "./auth/auth.module";
import * as typeOrmEntities from "@riddea/typeorm";

@Module({
  imports: [
    CollectionsModule,
    TypeOrmModule.forRootAsync({
      useFactory: async () => {
        return Object.assign(await getConnectionOptions(), {
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
