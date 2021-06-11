import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CollectionsModule } from "./collections/collections.module";
import { UsersModule } from "./users/users.module";
import { StatsModule } from "./stats/stats.module";
import { getConnectionOptions } from "typeorm";

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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
