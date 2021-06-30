import { Context } from "telegraf";
import { CommandInterface } from "./_interface";
import i18n from "../helpers/localization";

export default class extends CommandInterface {
  constructor() {
    super({
      description: "Send anime pictures for avatar",
      collectUsage: true,
      name: "test",
      actionsName: ["Shiro Service"],
      actions: ["NEW_AVATAR_SHIRO"],
    });
  }

  async run(ctx: Context) {
    ctx.reply(i18n.translate("changePublicType", { type: "12ewfewfewfewewf34" }));
  }
}
