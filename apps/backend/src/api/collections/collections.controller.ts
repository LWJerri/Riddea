import {
  CacheInterceptor,
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Query,
  Req,
  Res,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { ApiForbiddenResponse, ApiResponse } from "@nestjs/swagger";
import { FastifyReply, FastifyRequest } from "fastify";

import { apiLogger } from "..";
import { CollectionsService } from "./collections.service";
import { CollectionDTO, CollectionUploadsDTO } from "./dto/collection.dto";
import { GetCollectionImages } from "./validations/getCollectionImages";

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
  async getCollection(@Param("id") id: string, @Req() { session }: FastifyRequest) {
    try {
      const collection = await this.service.getCollection(id);
      if (!collection) {
        throw new NotFoundException(`Collection with ID ${id} not found`);
      }

      if (!collection.isPublic && session?.get("user")?.id !== collection.userID.toString()) {
        throw new ForbiddenException(`Collection with ID ${id} is private`);
      } else {
        return collection;
      }
    } catch (err) {
      apiLogger.error(`Collection controller error:`, err.stack);
      return err;
    }
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
  async getCollectionImages(
  @Query() query: GetCollectionImages,
    @Param("id") id: string,
    @Res() res: FastifyReply,
    @Req() { session }: FastifyRequest,
  ) {
    try {
      const { uploads, total, collection } = await this.service.getCollectionImages(id, query);

      if (!collection.isPublic && session?.get("user")?.id !== collection.userID.toString()) {
        throw new ForbiddenException(`Collection with ID ${id} is private`);
      } else {
        res.headers({
          total,
        });

        const lastPage = Math.ceil(total / query.limit);
        const isNext = query.page + 1 > lastPage - 1 ? false : true;

        res.send({ nextPage: isNext, data: uploads });
      }
    } catch (err) {
      apiLogger.error(`Collection controller error:`, err.stack);
      return err;
    }
  }
}
