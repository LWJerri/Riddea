import gl from "glob";
import { promisify } from "util";
import { get, set, template } from "lodash";
import fs from "fs";
import { botLogger } from "./logger";
const glob = promisify(gl);

export class I18n {
  translations: Record<string, any> = {};
  private lang = "en";

  constructor(lang?: string, translations?: Record<string, any>) {
    if (lang) this.lang = lang;
    if (translations) this.translations = translations;
  }

  public async init() {
    const files = await glob("locales/**");

    for (const f of files) {
      if (!f.endsWith(".json")) {
        continue;
      }

      const withoutLocales = f.replace("locales/", "").replace(".json", "");

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
