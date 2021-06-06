import { Injectable } from "@nestjs/common";
import { bot } from "../app";
import humanize from "humanize-duration";
import { commands } from "../helpers/loadCommands";

@Injectable()
export class AppService {
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
}
