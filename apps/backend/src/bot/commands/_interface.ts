import { Context } from "telegraf";
import { getRepository } from "typeorm";
import { Statistic } from "../../entities";
import { cmdLimiter } from "../constants";
import { botLogger } from "../helpers/logger";

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

  async execute(ctx) {
    try {
      if (this.cooldown && cmdLimiter.take(ctx.from.id))
        return await ctx.reply(ctx.i18n.translate("bot.main.errors.rate"));

      await this.run(ctx);
    } catch (err) {
      await ctx.reply(ctx.i18n.translate("bot.main.errors.error"));
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

  run(_ctx: Context): Promise<unknown> | unknown {
    throw new Error("Method not implemented");
  }
}
