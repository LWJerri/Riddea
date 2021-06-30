import { User } from "@riddea/typeorm";
import telegraf from "telegraf";
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
