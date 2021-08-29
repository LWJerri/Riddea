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
      //await req.session.destroy();
      await req.destroySession();
      await res.redirect(301, "/");
    } catch (err) {
      apiLogger.error(`Auth controller error:`, err.stack);
    }
  }
}
