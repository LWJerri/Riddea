import { Scenes } from "telegraf";

export default async function photoEvent(ctx: Scenes.SceneContext<Scenes.SceneSessionData>) {
  await ctx.scene.enter("upload");
}
