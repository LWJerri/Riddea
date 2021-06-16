import { Injectable } from "@nestjs/common";
import { bot } from "../app";
import humanize from "humanize-duration";
import { commands } from "../helpers/loadCommands";
import { Collection, Upload } from "@riddea/typeorm";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { botLogger } from "../helpers/logger";

@Injectable()
export class AppService {
  constructor() {}

  async getBotInfo() {
    try {
      const uptime = humanize(Math.floor(process.uptime()) * 1000, {
        round: true,
        language: "en",
      });

      return {
        username: bot.botInfo.username,
        id: bot.botInfo.id,
        uptime,
        version: process.env.npm_package_version,
      };
    } catch (err) {
      botLogger.error(`App service error:`, err.stack);
    }
  }

  async getCommandUsageList() {
    try {
      return commands.filter((c) => c.collectUsage).map((c) => c.name);
    } catch (err) {
      botLogger.error(`App service error:`, err.stack);
    }
  }
}
