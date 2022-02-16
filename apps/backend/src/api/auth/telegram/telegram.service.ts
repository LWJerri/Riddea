import { createHash, createHmac } from "crypto";

import { Injectable, ServiceUnavailableException, UnauthorizedException } from "@nestjs/common";

import { apiLogger } from "../..";
import { ConfirmLogin } from "./types";

@Injectable()
export class TelegramService {
  async confirmLogin({ hash, ...userData }: ConfirmLogin) {
    try {
      const botToken = process.env.TELEGRAM_BOT_TOKEN;

      if (!botToken) {
        apiLogger.error("Bot token not setuped, telegram authorization will not work.");
        throw new ServiceUnavailableException(
          "Sorry, we have error on our side. Please contact with LWJerri (https://t.me/LWJerri).",
        );
      }

      const secretKey = createHash("sha256").update(botToken).digest();

      const dataCheckString = Object.keys(userData)
        .sort()
        .map((key) => `${key}=${userData[key]}`)
        .join("\n");

      const hmac = createHmac("sha256", secretKey).update(dataCheckString).digest("hex");

      if (hmac === hash) {
        return userData;
      } else {
        throw new UnauthorizedException("Hash missmatch.");
      }
    } catch (err) {
      apiLogger.error(`Telegram service error:`, err.stack);
    }
  }
}
