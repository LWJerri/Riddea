import { Inject, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { InjectRepository } from "@nestjs/typeorm";
import { Collection, Upload } from "@riddea/typeorm";
import { IsNull, Not, Repository } from "typeorm";
import { GetCollectionImagesDto } from "./dto/getCollectionImages.dto";

@Injectable()
export class CollectionsService {
  constructor(
    @InjectRepository(Collection) private collectionRepository: Repository<Collection>,
    @InjectRepository(Upload) private uploadRepository: Repository<Upload>,
    @Inject("BOT_SERVICE") private botMicroservice: ClientProxy,
  ) {}

  async getCollection(id: string) {
    const collection = await this.collectionRepository.findOne(id);

    if (!collection) {
      throw new NotFoundException(`Collection ${id} not found.`);
    }

    if (!collection.isPublic) {
      throw new UnauthorizedException(`Collection ${id} is private`);
    }

    return collection;
  }

  getCollectionsByUser(userID: string | number) {
    return this.collectionRepository.find({ userID: Number(userID), isPublic: true });
  }

  async getCollectionImages(id: string, query: GetCollectionImagesDto) {
    const [collection, uploads, isNext, total] = await Promise.all([
      this.collectionRepository.findOne({
        where: {
          id,
        },
      }),

      this.uploadRepository.find({
        where: {
          collection: {
            id,
          },
          data: Not(IsNull()),
        },
        take: Number(query.limit),
        skip: Number(query.limit) * (Number(query.page) - 1),
        order: {
          createdAt: "DESC",
        },
      }),

      this.uploadRepository.find({
        where: {
          collection: {
            id,
          },
          data: Not(IsNull()),
        },
        take: Number(query.limit),
        skip: Number(query.limit) * Number(query.page),
        order: {
          createdAt: "ASC",
        },
      }),

      this.uploadRepository.count({
        where: {
          collection: {
            id,
          },
          data: Not(IsNull()),
        },
      }),
    ]);

    if (!collection) {
      throw new NotFoundException(`Collection ${id} not found.`);
    }

    if (!collection.isPublic) {
      throw new UnauthorizedException(`Collection ${id} is private`);
    }

    const images = uploads.map((u) => u.data);

    return [images, total, Boolean(isNext.length)];
  }
}
