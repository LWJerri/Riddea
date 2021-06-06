import { CacheInterceptor, Controller, Get, UseInterceptors } from "@nestjs/common";
import { StatsService } from "./stats.service";

@Controller("/v1/stats")
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get()
  @UseInterceptors(CacheInterceptor)
  root() {
    return this.statsService.stats();
  }
}
