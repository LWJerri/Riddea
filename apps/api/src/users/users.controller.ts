import { CacheInterceptor, Controller, Get, Param, UseInterceptors } from "@nestjs/common";
import { ApiResponse} from "@nestjs/swagger";
import { CollectionsService } from "../collections/collections.service";
import { CollectionDTO } from "../collections/dto/collection.dto";

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
  getUserCollections(@Param("userId") userId: string) {
    return this.collectionsService.getCollectionsByUser(userId);
  }
}
