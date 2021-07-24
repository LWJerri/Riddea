import { Injectable } from "@nestjs/common";
import { bot } from "../main";
import humanize from "humanize-duration";
import { commands } from "../helpers/loadCommands";
import { botLogger } from "../helpers/logger";

const pkg = require('../../../package.json')

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
        version: pkg.version,
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
