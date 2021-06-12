import { Injectable, ServiceUnavailableException, UnauthorizedException } from "@nestjs/common";
import { createHash, createHmac } from "crypto";
import { apiLogger } from "../../main";

@Injectable()
export class TelegramService {
  async confirmLogin({ hash, ...userData }) {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;

    if (!botToken) {
      apiLogger.error("Bot token not setuped, telegram authorization will not work.");
      throw new ServiceUnavailableException("Sorry, we have error on our side. Please contact site owners.");
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
  }
}
