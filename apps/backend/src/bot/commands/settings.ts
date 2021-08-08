import { Scenes } from "telegraf";
import { CommandInterface } from "./_interface";

export default class extends CommandInterface {
  constructor() {
    super({
      name: "settings",
      collectUsage: false,
      cooldown: false,
      description: "Your personal settings",
      actions: [{ callback: "USER_SETTINGS" }],
    });
  }

  async run(ctx: Scenes.SceneContext<Scenes.SceneSessionData>) {
    await ctx.scene.enter("mySetting");
  }
}
