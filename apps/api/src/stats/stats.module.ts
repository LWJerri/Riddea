import { CacheModule, Module } from "@nestjs/common";
import { StatsController } from "./stats.controller";
import { StatsService } from "./stats.service";
import { MicroserviceModule } from "../microservice.module";

@Module({
  imports: [
    MicroserviceModule,
    CacheModule.register({
      ttl: process.env.NODE_ENV === "production" ? 120 : 5,
      max: 1000,
    }),
  ],
  controllers: [StatsController],
  providers: [StatsService],
})
export class StatsModule {}
