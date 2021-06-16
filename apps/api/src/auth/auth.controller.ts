import { Controller, Get, Request } from "@nestjs/common";
import { ApiExcludeEndpoint } from "@nestjs/swagger";
import { FastifyRequest } from "fastify";
import { apiLogger } from "../main";

@Controller("/v1/auth")
export class AuthController {
  @ApiExcludeEndpoint()
  @Get()
  getMe(@Request() req: FastifyRequest) {
    return req.session.get("user");
  }

  @ApiExcludeEndpoint()
  @Get("/logout")
  logout(@Request() req: FastifyRequest) {
    try {
      return req.session.destroy();
    } catch (err) {
      apiLogger.error(`Auth controller error:`, err.stack);
    }
  }
}
