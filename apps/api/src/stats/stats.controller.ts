import { CacheInterceptor, Controller, Get, UseInterceptors } from "@nestjs/common";
import { ApiResponse } from "@nestjs/swagger";
import { StatsService } from "./stats.service";

@Controller("/v1/stats")
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get()
  @UseInterceptors(CacheInterceptor)
  @ApiResponse({
    status: 200,
    description: "Project statistic",
  })
  root() {
    return this.statsService.stats();
  }
}
