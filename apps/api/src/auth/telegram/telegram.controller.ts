import { Controller, Get, Response, Query, Request } from "@nestjs/common";
import { FastifyReply, FastifyRequest } from "fastify";
import { TelegramService } from "./telegram.service";

@Controller("/v1/auth/telegram")
export class TelegramController {
  constructor(private readonly telegramService: TelegramService) {}

  @Get("callback")
  async telegramCallback(@Query() query: any, @Request() req: FastifyRequest, @Response() res: FastifyReply) {
    const user = await this.telegramService.confirmLogin(query);
    req.session.set("user", user);
    return res.redirect(302, "/");
  }
}
