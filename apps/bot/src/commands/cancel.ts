import { Scenes } from "telegraf";
import i18n from "../helpers/localization";
import { CommandInterface } from "./_interface";

export default class extends CommandInterface {
  constructor() {
    super({
      description: "Cancel any stage you entered",
      collectUsage: false,
      cooldown: false,
      name: "cancel",
    });
  }

  async run(ctx: Scenes.SceneContext) {
    ctx.scene.current?.leave();
    await ctx.reply(i18n.translate("leaveScene"));
  }
}
