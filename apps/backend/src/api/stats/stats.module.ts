import { CacheModule, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Statistic, Upload } from "../../entities";
import { StatsController } from "./stats.controller";
import { StatsService } from "./stats.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Statistic, Upload]),
    CacheModule.register({
      ttl: process.env.NODE_ENV === "production" ? 120 : 5,
      max: 1000,
    }),
  ],
  controllers: [StatsController],
  providers: [StatsService],
})
export class StatsModule {}
