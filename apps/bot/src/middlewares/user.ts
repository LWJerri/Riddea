import { User } from "@riddea/typeorm";
import { Context } from "telegraf";
import { getRepository } from "typeorm";

export default async function userMiddleware(ctx: Context, next: Function) {
  const repository = getRepository(User);
  const user = await repository.findOne({ userID: ctx.from.id });
  if (user) {
    ctx.userEntity = user;
  } else {
    if (!ctx.chat?.id) return null;

    ctx.userEntity = await repository.save({ userID: ctx.from.id });
  }

  next();
}
