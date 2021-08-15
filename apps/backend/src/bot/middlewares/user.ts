import { Context } from "telegraf";
import { getRepository } from "typeorm";

import { User } from "../../entities";

export default async function userMiddleware(ctx: Context, next: () => void) {
  const repository = getRepository(User);
  const user = await repository.findOne({ userID: ctx.from.id });
  if (user) {
    ctx.userEntity = user;
  } else {
    if (!ctx.from.id) return null;

    ctx.userEntity = await repository.save({ userID: ctx.from.id, lang: "en" });
  }

  next();
}
