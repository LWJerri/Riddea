import { Controller, Get, Request } from "@nestjs/common";
import { FastifyRequest } from "fastify";

@Controller("/v1/auth")
export class AuthController {
  @Get()
  getMe(@Request() req: FastifyRequest) {
    return req.session.get("user");
  }
}
