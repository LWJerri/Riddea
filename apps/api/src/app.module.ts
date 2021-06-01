import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { CollectionsModule } from "./collections/collections.module";
import { UsersModule } from "./users/users.module";
import { StatsModule } from "./stats/stats.module";

@Module({
    imports: [CollectionsModule, TypeOrmModule.forRoot(), UsersModule, StatsModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
