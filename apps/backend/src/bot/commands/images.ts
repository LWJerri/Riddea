import { Scenes } from "telegraf";

import { CommandInterface } from "./_interface";

export default class extends CommandInterface {
  constructor() {
    super({
      name: "images",
      collectUsage: false,
      cooldown: false,
      description: "Display all your uploaded images",
    });
  }

  async run(ctx: Scenes.SceneContext<Scenes.SceneSessionData>) {
    await ctx.scene.enter("myImages");
  }
}
