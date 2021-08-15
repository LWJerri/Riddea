import fs from "fs";
import { resolve } from "path";
import { promisify } from "util";

import gl from "glob";
import { get, set, template } from "lodash";


import { backendLogger } from "../helpers/logger";


const glob = promisify(gl);

export class I18n {
  translations: Record<string, string> = {};
  private lang = "en";

  constructor(lang?: string, translations?: Record<string, string>) {
    if (lang) this.lang = lang;
    if (translations) this.translations = translations;
  }

  public async init() {
    const cwdPath = resolve(process.cwd(), "..", "..");
    const files = await glob("locales/**", { cwd: cwdPath });
    for (const f of files.filter((f) => f.endsWith(".json"))) {
      const withoutLocales = f.replace("locales/", "").replace(".json", "");

      try {
        const filePath = resolve(cwdPath, f);
        const content: Record<string, unknown> = JSON.parse(fs.readFileSync(filePath, "utf8"));

        set(this.translations, withoutLocales.split("/").join("."), content);
      } catch (e) {
        backendLogger.error("Incorrect JSON file: " + f);
        backendLogger.error(e.stack);
      }
    }
    return true;
  }

  clone(lang: string) {
    return new I18n(lang, this.translations);
  }

  translate(path: string, data?: Record<string, string>) {
    const defaultTranslation = get(this.translations, `${this.lang}.${path}`, "Translate not found! Please, contact with @LWJerri!");
    const str = get(this.translations, `${this.lang}.${path}`, defaultTranslation);
    const result = template(str, { interpolate: /{{([\s\S]+?)}}/g });
    return result(data);
  }
}

export const i18n = new I18n();
export default i18n;
