import { CacheInterceptor, Controller, Get, Param, Query, Res, UseInterceptors, UsePipes, ValidationPipe } from "@nestjs/common";
import { CollectionsService } from "./collections.service";
import { GetCollectionImagesDto } from "./dto/getCollectionImages.dto";
import { FastifyReply } from "fastify";
import { Collection, Upload } from "@riddea/typeorm";
import { ApiResponse, OmitType, PartialType } from "@nestjs/swagger";

@Controller("/v1/collections")
export class CollectionsController {
  constructor(private service: CollectionsService) {}

  @Get("/:id")
  @UseInterceptors(CacheInterceptor)
  @ApiResponse({
    status: 200,
    description: "The found collection",
    type: class CollectionDTO extends PartialType(OmitType(Collection, ["uploads"] as const)) {},
  })
  getCollection(@Param("id") id: string) {
    return this.service.getCollection(id);
  }

  @Get("/:id/images")
  @UseInterceptors(CacheInterceptor)
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiResponse({
    status: 200,
    description: "The found images",
    type: [class UploadsDTO extends PartialType(OmitType(Upload, ["collection"] as const)) {}],
  })
  async getCollectionImages(@Query() query: GetCollectionImagesDto, @Param("id") id: string, @Res() res: FastifyReply) {
    const [images, total, isNext] = await this.service.getCollectionImages(id, query);
    res.headers({
      total,
    });

    res.send({ nextPage: isNext, data: images });
  }
}
