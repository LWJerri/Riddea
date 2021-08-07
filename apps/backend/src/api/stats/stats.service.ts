import { Inject, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Statistic, Upload } from "../../entities";
import { Repository } from "typeorm";
import { StatsDTO } from "./dto/stats.dto";
import { commands } from '../../bot/helpers/loadCommands'
import humanize from "humanize-duration";
import { bot } from '../../bot'

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
      const commandsUsage = commands.reduce((prev: any, current: any, index: any) => {
        return {
          ...prev,
          [current]: counts[index],
        };
      }, {});

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
      }

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
