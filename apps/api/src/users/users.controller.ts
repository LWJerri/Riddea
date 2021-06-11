import { CacheInterceptor, Controller, Get, Param, UseInterceptors } from "@nestjs/common";
import { Collection } from "@riddea/typeorm";
import { ApiResponse, PartialType, OmitType } from "@nestjs/swagger";
import { CollectionsService } from "../collections/collections.service";

@Controller("/v1/users")
export class UsersController {
  constructor(private readonly collectionsService: CollectionsService) {}

  @Get("/:userId/collections")
  @UseInterceptors(CacheInterceptor)
  @ApiResponse({
    status: 200,
    description: "The found collections",
    type: [class CollectionDTO extends PartialType(OmitType(Collection, ["uploads"] as const)) {}],
  })
  getUserCollections(@Param("userId") userId: string) {
    return this.collectionsService.getCollectionsByUser(userId);
  }
}
