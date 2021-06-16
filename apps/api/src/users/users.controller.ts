import { CacheInterceptor, Controller, Get, Param, UseInterceptors, Request } from "@nestjs/common";
import { ApiResponse } from "@nestjs/swagger";
import { FastifyRequest } from "fastify";
import { CollectionsService } from "../collections/collections.service";
import { CollectionDTO } from "../collections/dto/collection.dto";
import { apiLogger } from "../main";

@Controller("/v1/users")
export class UsersController {
  constructor(private readonly collectionsService: CollectionsService) {}

  @Get("/:userId/collections")
  @UseInterceptors(CacheInterceptor)
  @ApiResponse({
    status: 200,
    description: "The found collections",
    type: [CollectionDTO],
  })
  getUserCollections(@Param("userId") userId: string, @Request() req: FastifyRequest) {
    try {
      return this.collectionsService.getCollectionsByUser(userId, req.session);
    } catch (err) {
      apiLogger.error(`Users controller error:`, err.stack);
    }
  }
}
