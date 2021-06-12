import { ExecutionContext, Injectable, CanActivate } from '@nestjs/common'
import { FastifyRequest } from 'fastify'

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const request: FastifyRequest = context.switchToHttp().getRequest()
    return Boolean(request.session.get('user'))
  }
}
