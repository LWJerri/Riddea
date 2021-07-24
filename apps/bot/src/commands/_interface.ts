import { Context } from "telegraf";
import { getRepository } from "typeorm";
import { Statistic } from "@riddea/typeorm";
import { botLogger } from "../helpers/logger";
import { cmdLimiter } from "../constants";

export type CommandOptions = {
  name: string;
  description: string;
  collectUsage?: boolean;
  cooldown: boolean;
  actions?: Array<{ name?: string; callback: string }>;
};

export class CommandInterface {
  private statisticRepository = getRepository(Statistic);
  name: string;
  description: string;
  collectUsage?: boolean;
  cooldown: boolean;
  actions?: Array<{ name?: string; callback: string }>;

  constructor(options?: CommandOptions) {
    options = {
      collectUsage: typeof options.collectUsage === undefined ? false : options.collectUsage,
      ...options,
    };

    Object.assign(this, options);
  }

  async execute(ctx: Context) {
    try {
      if (this.cooldown) {
        return cmdLimiter.take(ctx.from.id) ? await ctx.reply(ctx.i18n.translate("rateLimit")) : await this.run(ctx);
      }

      await this.run(ctx);
    } catch (err) {
      await ctx.reply(ctx.i18n.translate("errorMessage"));
      botLogger.error(`Command interface error:`, err.stack);
    }

    if (this.collectUsage) {
      try {
        await this.statisticRepository.save({ command: this.name, userID: ctx.from.id });
      } catch (err) {
        botLogger.error(`Command interface error:`, err.stack);
      }
    }
  }

  run(ctx: Context): Promise<any> | any {
    throw new Error("Method not implemented");
  }
}
