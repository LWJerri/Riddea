import { Controller, Get, Request, Response } from "@nestjs/common";
import { ApiExcludeEndpoint } from "@nestjs/swagger";
import { FastifyReply, FastifyRequest } from "fastify";

import { apiLogger } from "..";

@Controller("/v1/auth")
export class AuthController {
  @ApiExcludeEndpoint()
  @Get()
  getMe(@Request() req: FastifyRequest) {
    return req.session.get("user");
  }

  @ApiExcludeEndpoint()
  @Get("/logout")
  async logout(@Request() req: FastifyRequest, @Response() res: FastifyReply) {
    try {
      await req.session.destroy();

      setTimeout(async () => {
        await res.redirect(301, "/");
      }, 3000);
    } catch (err) {
      apiLogger.error(`Auth controller error:`, err.stack);
    }
  }
}
