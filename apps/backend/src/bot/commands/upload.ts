import { Scenes } from "telegraf";

import { CommandInterface } from "./_interface";

export default class extends CommandInterface {
  constructor() {
    super({
      name: "upload",
      description: "Upload your favorite picture",
      collectUsage: false,
      cooldown: false,
    });
  }

  async run(ctx: Scenes.SceneContext<Scenes.SceneSessionData>) {
    await ctx.scene.enter("upload");
  }
}
