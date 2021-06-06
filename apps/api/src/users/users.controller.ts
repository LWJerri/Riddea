import { CacheInterceptor, Controller, Get, Param, UseInterceptors } from "@nestjs/common";
import { CollectionsService } from "src/collections/collections.service";

@Controller("/v1/users")
export class UsersController {
  constructor(private readonly collectionsService: CollectionsService) {}

  @Get("/:userId/collections")
  @UseInterceptors(CacheInterceptor)
  getUserCollections(@Param("userId") userId: string) {
    return this.collectionsService.getCollectionsByUser(userId);
  }
}
