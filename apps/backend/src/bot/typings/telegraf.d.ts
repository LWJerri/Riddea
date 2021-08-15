import { Context } from "vm";

import { CallbackQuery } from "typegram";

import { User } from "../../entities";
import { I18n } from "../helpers/localization";



declare module "telegraf" {
  interface Context {
    isAction: boolean;
    userEntity: User;
    i18n: I18n;
  }

  interface SceneContext {
    userEntity: User;
    i18n: I18n;
  }
}

export interface ContextCallbackWithData extends Context {
  callbackQuery?: CallbackQuery & { data?: string };
  i18n: I18n;
}
