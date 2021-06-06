import { CacheModule, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Statistic, Upload } from "@riddea/typeorm";
import { StatsController } from "./stats.controller";
import { StatsService } from "./stats.service";
import { MicroserviceModule } from "../microservice.module";

@Module({
  imports: [
    MicroserviceModule,
    TypeOrmModule.forFeature([Statistic, Upload]),
    CacheModule.register({
      ttl: process.env.NODE_ENV === "development" ? 5 : 120,
      max: 1000,
    }),
  ],
  controllers: [StatsController],
  providers: [StatsService],
})
export class StatsModule {}
