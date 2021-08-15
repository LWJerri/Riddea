import { Scenes } from "telegraf";

import { botLogger } from "../helpers/logger";

export default async function photoEvent(ctx: Scenes.SceneContext<Scenes.SceneSessionData>) {
  try {
    await ctx.scene.enter("upload");
  } catch (err) {
    await ctx.reply(ctx.i18n.translate("errorMessage"));
    botLogger.error(`Photo event error:`, err.stack);
  }
}
