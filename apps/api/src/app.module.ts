import { Module } from "@nestjs/common";
import { CollectionsModule } from "./collections/collections.module";
import { UsersModule } from "./users/users.module";
import { StatsModule } from "./stats/stats.module";
import { TelegramModule } from "./auth/telegram/telegram.module";
import { AuthModule } from "./auth/auth.module";

@Module({
  imports: [CollectionsModule, UsersModule, StatsModule, TelegramModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
