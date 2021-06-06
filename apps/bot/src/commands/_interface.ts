import { Context } from "telegraf";
import { getRepository } from "typeorm";
import { Statistic } from "@riddea/typeorm";
import { botLogger } from "../helpers/logger";

export type CommandOptions = {
  name: string;
  description: string;
  collectUsage?: boolean;
  aliases?: string[];
  action?: string;
};

export class CommandInterface {
  private statisticRepository = getRepository(Statistic);
  description: string;
  collectUsage: boolean;
  name: string;
  aliases?: string[];
  action?: string;

  constructor(options?: CommandOptions) {
    options = {
      collectUsage: typeof options.collectUsage === undefined ? false : options.collectUsage,
      ...options,
    };

    Object.assign(this, options);
  }

  async execute(ctx: Context) {
    try {
      await this.run(ctx);
    } catch (e) {
      ctx.reply("We are sorry, some error happend on our side. :(");
      botLogger.error(e, e.stack);
    }

    if (this.collectUsage) {
      await this.statisticRepository.save({ command: this.name });
    }
  }

  run(ctx: Context): Promise<any> | any {
    throw new Error("Method not implemented");
  }
}
