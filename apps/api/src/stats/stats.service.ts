import { Inject, Injectable, Logger } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { prisma } from "../libs/prisma";
import { StatsDTO } from "./dto/stats.dto";

@Injectable()
export class StatsService {
  private readonly logger = new Logger(StatsService.name);

  constructor(@Inject("BOT_SERVICE") private botMicroservice: ClientProxy) {}

  async stats(): Promise<StatsDTO> {
    try {
      const commands: string[] = await this.botMicroservice
        .send({ cmd: "getCommandsUsageList" }, {})
        .toPromise()
        .catch(() => []);

      const counts = await Promise.all(commands.map((command) => prisma.statistic.count({ where: { command } })));
      const commandsUsage = commands.reduce((prev: any, current: any, index: any) => {
        return {
          ...prev,
          [current]: counts[index],
        };
      }, {});

      const uploads = await prisma.upload.count();

      let botInfo: any;
      try {
        botInfo = await this.botMicroservice.send({ cmd: "getBotInfo" }, {}).toPromise();
      } catch (error) {
        this.logger.error(`BOT Microservice Unreacheable, setted botInfo to null. Reason: ${error.message}`);
        botInfo = null;
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
