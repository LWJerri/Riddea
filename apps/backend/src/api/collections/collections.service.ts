import { Session } from "@mgcrea/fastify-session";
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IsNull, Not, Repository } from "typeorm";

import { apiLogger } from "..";
import { Collection, Upload } from "../../entities";
import { GetCollectionImages } from "./validations/getCollectionImages";

@Injectable()
export class CollectionsService {
  constructor(
    @InjectRepository(Collection) private collectionRepository: Repository<Collection>,
    @InjectRepository(Upload) private uploadRepository: Repository<Upload>,
  ) {}

  async getCollection(id: string) {
    try {
      const collection = await this.collectionRepository.findOne(id);

      if (!collection) {
        throw new NotFoundException(`Collection with ID ${id} not found.`);
      }

      return collection;
    } catch (err) {
      apiLogger.error(`Collection service error:`, err.stack);
    }
  }

  getCollectionsByUser(userID: string | number, session?: Session) {
    try {
      return this.collectionRepository.find({
        userID: Number(userID),
        isPublic: session?.get("user")?.id == userID ? Not(IsNull()) : true,
      });
    } catch (err) {
      apiLogger.error(`Collection service error:`, err.stack);
    }
  }

  async getCollectionImages(id: string, query: GetCollectionImages) {
    try {
      const [collection, uploads, total] = await Promise.all([
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
            fileName: Not(IsNull()),
          },
          take: Number(query.limit),
          skip: Number(query.limit) * (Number(query.page) - 1),
          order: {
            createdAt: "DESC",
          },
        }),

        this.uploadRepository.count({
          where: {
            collection: {
              id,
            },
            fileName: Not(IsNull()),
          },
        }),
      ]);

      if (!collection) {
        throw new NotFoundException(`Collection with ID ${id} not found.`);
      }

      //if (!collection.isPublic) {
      //  throw new ForbiddenException(`Collection with ID ${id} is private`);
      //}

      const endPoint = `https://${process.env.S3_BUCKET}.${process.env.S3_ENDPOINT.replace("https://", "").replace("http://", "")}`;

      return {
        collection,
        uploads:
          uploads?.map((u) => ({
            ...u,
            fileUrl: `${endPoint}/uploads/${u.filePath}`,
          })) ?? [],
        total,
      };
    } catch (err) {
      apiLogger.error(`Collection service error:`, err.stack);
    }
  }
}
