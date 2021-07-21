import gl from "glob";
import { promisify } from "util";
import { get, set, template } from "lodash";
import fs from "fs";
import { botLogger } from "./logger";
import { resolve } from "path";
import path from "path";
const glob = promisify(gl);

export class I18n {
  translations = {};
  private lang = "en";

  constructor(lang?: string, translations?: any) {
    if (lang) this.lang = lang;
    if (translations) this.translations = translations;
  }

  public async init() {
    const files = await glob(process.env.INIT_CWD + "/locales/**");

    for (const f of files) {
      if (!f.endsWith(".json")) {
        continue;
      }

      const withoutLocales = f.replace(process.env.INIT_CWD + "/locales/", "").replace(".json", "");

      console.log(withoutLocales);
      try {
        set(this.translations, withoutLocales.split("/").join("."), JSON.parse(fs.readFileSync(f, "utf8")));
      } catch (e) {
        botLogger.error("Incorrect JSON file: " + f);
        botLogger.error(e.stack);
      }
    }

    return true;
  }

  clone(lang: string) {
    return new I18n(lang, this.translations);
  }

  translate(path: string, data?: Record<string, any>) {
    const defaultTranslation = get(this.translations, `${this.lang}.${path}`, "Translate not found! Please, contact with @LWJerri!");
    const str = get(this.translations, `${this.lang}.${path}`, defaultTranslation);
    const result = template(str, { interpolate: /{{([\s\S]+?)}}/g });
    return result(data);
  }
}

export const i18n = new I18n();
export default i18n;
