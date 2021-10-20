import { Scenes } from "telegraf";
import { CommandInterface } from "./_interface";

export default class extends CommandInterface {
  constructor() {
    super({
      name: "editimage",
      collectUsage: false,
      cooldown: false,
      description: "Edit image by ID",
    });
  }

  async run(ctx: Scenes.SceneContext<Scenes.SceneSessionData>) {
    await ctx.scene.enter("imageEdit");
  }
}
