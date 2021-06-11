import { CacheInterceptor, Controller, Get, UseInterceptors } from "@nestjs/common";
import { ApiResponse } from "@nestjs/swagger";
import { StatsDTO } from "./dto/stats.dto";
import { StatsService } from "./stats.service";

@Controller("/v1/stats")
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get()
  @UseInterceptors(CacheInterceptor)
  @ApiResponse({
    status: 200,
    description: "Project statistic",
    type: StatsDTO,
  })
  root() {
    return this.statsService.stats();
  }
}
