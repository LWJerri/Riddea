import { Injectable } from "@nestjs/common";
import { bot } from "../app";
import humanize from "humanize-duration";
import { commands } from "../helpers/loadCommands";
import { Collection, Upload } from "@riddea/typeorm";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Collection) private collectionRepository: Repository<Collection>,
    @InjectRepository(Upload) private uploadRepository: Repository<Upload>,
  ) {}

  async getBotInfo() {
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
  }

  async getCommandUsageList() {
    return commands.filter((c) => c.collectUsage).map((c) => c.name);
  }

  getImagesLinks(ids: string[]) {
    return Promise.all(ids.map(async (id) => await bot.telegram.getFileLink(id)));
  }
}
