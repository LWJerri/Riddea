import { CacheInterceptor, Controller, Get, Param, Query, Res, UseInterceptors, UsePipes, ValidationPipe } from "@nestjs/common";
import { CollectionsService } from "./collections.service";
import { GetCollectionImagesDto } from "./dto/getCollectionImages.dto";
import { FastifyReply } from "fastify";

@Controller("/v1/collections")
export class CollectionsController {
  constructor(private service: CollectionsService) {}

  @Get("/:id")
  @UseInterceptors(CacheInterceptor)
  getCollection(@Param("id") id: string) {
    return this.service.getCollection(id);
  }

  @Get("/:id/images")
  @UseInterceptors(CacheInterceptor)
  @UsePipes(new ValidationPipe({ transform: true }))
  async getCollectionImages(@Query() query: GetCollectionImagesDto, @Param("id") id: string, @Res() res: FastifyReply) {
    const [images, total, isNext] = await this.service.getCollectionImages(id, query);
    res.headers({
      total,
    });

    res.send({ nextPage: isNext, pictures: images });
  }
}
