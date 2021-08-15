import { Context } from "telegraf";

import i18n from "../../libs/i18n";

export default async function i18nMiddleware(ctx: Context, next: Function) {
  ctx.i18n = i18n.clone(ctx.userEntity.lang);
  next();
}
