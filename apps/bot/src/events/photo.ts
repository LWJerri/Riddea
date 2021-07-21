import { Scenes } from "telegraf";
import i18n from "../helpers/localization";
import { botLogger } from "../helpers/logger";

export default async function photoEvent(ctx: Scenes.SceneContext<Scenes.SceneSessionData>) {
  try {
    await ctx.scene.enter("upload");
  } catch (err) {
    await ctx.reply(i18n.translate("errorMessage"));
    botLogger.error(`Photo event error:`, err.stack);
  }
}
