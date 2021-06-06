import { CacheInterceptor, Controller, Get, Param, UseInterceptors } from "@nestjs/common";
import { CollectionsService } from "./collections.service";

@Controller("/v1/collections")
export class CollectionsController {
  constructor(private service: CollectionsService) {}

  @Get("/:id")
  @UseInterceptors(CacheInterceptor)
  getCollection(@Param("id") id: string) {
    return this.service.getCollection(id);
  }
}
