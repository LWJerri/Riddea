import { Scenes } from "telegraf";
import { CommandInterface } from "./_interface";

export default class extends CommandInterface {
  constructor() {
    super({
      name: "createcollection",
      description: "Create new collection",
    });
  }

  async run(ctx: Scenes.SceneContext) {
    await ctx.scene.enter("createCollection");
  }
}
