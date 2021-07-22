import { Scenes } from "telegraf";
import { CommandInterface } from "./_interface";

export default class extends CommandInterface {
  constructor() {
    super({
      name: "createcollection",
      collectUsage: false,
      cooldown: false,
      description: "Create new collection",
    });
  }

  async run(ctx: Scenes.SceneContext) {
    await ctx.scene.enter("createCollection");
  }
}
