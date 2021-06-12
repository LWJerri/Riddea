import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CollectionsModule } from "./collections/collections.module";
import { UsersModule } from "./users/users.module";
import { StatsModule } from "./stats/stats.module";
import { getConnectionOptions } from "typeorm";
import { TelegramModule } from "./auth/telegram/telegram.module";
import { AuthModule } from "./auth/auth.module";

@Module({
  imports: [
    CollectionsModule,
    TypeOrmModule.forRootAsync({
      useFactory: async () =>
        Object.assign(await getConnectionOptions(), {
          autoLoadEntities: true,
        }),
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
