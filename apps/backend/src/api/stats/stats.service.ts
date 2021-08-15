import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import humanize from "humanize-duration";
import { Repository } from "typeorm";

import { bot } from "../../bot";
import { commands } from "../../bot/helpers/loadCommands";
import { Statistic, Upload } from "../../entities";
import { StatsDTO } from "./dto/stats.dto";



// eslint-disable-next-line @typescript-eslint/no-var-requires
const pkg = require("../../../../package.json");

@Injectable()
export class StatsService {
  private readonly logger = new Logger(StatsService.name);

  constructor(
    @InjectRepository(Statistic) private statisticRepository: Repository<Statistic>,
    @InjectRepository(Upload) private uploadRepository: Repository<Upload>,
  ) {}

  async stats(): Promise<StatsDTO> {
    try {
      const counts = await Promise.all(commands.map((command) => this.statisticRepository.count({ command: command.name })));
      const commandsUsage = commands.reduce((prev, current, index) => {
        return {
          ...prev,
          [current.name]: counts[index],
        };
      }, {} as Record<string, number>);

      const uploads = await this.uploadRepository.count();

      const uptime = humanize(Math.floor(process.uptime()) * 1000, {
        round: true,
        language: "en",
      });
      const botInfo = {
        username: bot.botInfo.username,
        id: bot.botInfo.id,
        uptime,
        version: pkg.version,
      };

      return {
        commandsUsage,
        uploads,
        botInfo,
      };
    } catch (err) {
      this.logger.error(`Stats service error:`, err.stack);
    }
  }
}
