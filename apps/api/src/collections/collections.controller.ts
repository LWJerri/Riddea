import { CacheInterceptor, Controller, Get, Param, Query, Res, UseInterceptors, UsePipes, ValidationPipe } from "@nestjs/common";
import { CollectionsService } from "./collections.service";
import { GetCollectionImages } from "./validations/getCollectionImages";
import { FastifyReply } from "fastify";
import { ApiForbiddenResponse, ApiHeader, ApiResponse } from "@nestjs/swagger";
import { CollectionDTO, CollectionUploadsDTO } from "./dto/collection.dto";

@Controller("/v1/collections")
export class CollectionsController {
  constructor(private service: CollectionsService) {}

  @Get("/:id")
  @UseInterceptors(CacheInterceptor)
  @ApiResponse({
    status: 200,
    description: "The found collection",
    type: CollectionDTO,
  })
  @ApiForbiddenResponse({ status: 403, description: "Collection is private" })
  getCollection(@Param("id") id: string) {
    return this.service.getCollection(id);
  }

  @Get("/:id/images")
  @UseInterceptors(CacheInterceptor)
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiResponse({
    status: 200,
    description: "The found images",
    type: () => CollectionUploadsDTO,
    headers: {
      total: {
        example: 100,
        description: "Total images by query.",
        schema: {
          type: "number",
        },
      },
    },
  })
  @ApiForbiddenResponse({ status: 403, description: "Collection is private" })
  async getCollectionImages(@Query() query: GetCollectionImages, @Param("id") id: string, @Res() res: FastifyReply) {
    const [images, total] = await this.service.getCollectionImages(id, query);
    res.headers({
      total,
    });

    const lastPage = Math.ceil((total as any) / query.limit);
    const isNext = parseInt(query.page++ as any) > lastPage - 1 ? false : true;

    res.send({ nextPage: isNext, data: images });
  }
}
