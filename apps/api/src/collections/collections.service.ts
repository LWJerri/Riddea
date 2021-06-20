import { Session } from "@mgcrea/fastify-session";
import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { prisma } from "../libs/prisma";
import { apiLogger } from "../main";
import { GetCollectionImages } from "./validations/getCollectionImages";

@Injectable()
export class CollectionsService {
  constructor() {}

  async getCollection(id: string | number) {
    try {
      id = Number(id);
      const collection = await prisma.collection.findFirst({ where: { id } });

      if (!collection) {
        throw new NotFoundException(`Collection with ID ${id} not found.`);
      }

      if (!collection.isPublic) {
        throw new ForbiddenException(`Collection with ID ${id} is private`);
      }

      return collection;
    } catch (err) {
      apiLogger.error(`Collection service error:`, err.stack);
    }
  }

  getCollectionsByUser(userID: string | number, session?: Session) {
    try {
      return prisma.collection.findMany({
        where: {
          userID: Number(userID),
          isPublic: session?.get("user")?.id == userID ? undefined : true,
        },
      });
    } catch (err) {
      apiLogger.error(`Collection service error:`, err.stack);
    }
  }

  async getCollectionImages(id: string, query: GetCollectionImages) {
    try {
      const [collection, uploads, total] = await Promise.all([
        prisma.collection.findFirst({
          where: {
            id: Number(id),
          },
        }),
        prisma.upload.findMany({
          where: {
            collectionId: Number(id),
          },
          take: Number(query.limit),
          skip: Number(query.limit) * (Number(query.page) - 1),
          orderBy: {
            createdAt: "desc",
          },
        }),

        prisma.upload.count({
          where: {
            collectionId: Number(id),
          },
        }),
      ]);

      if (!collection) {
        throw new NotFoundException(`Collection with ID ${id} not found.`);
      }

      if (!collection.isPublic) {
        throw new ForbiddenException(`Collection with ID ${id} is private`);
      }

      return [uploads, total];
    } catch (err) {
      apiLogger.error(`Collection service error:`, err.stack);
    }
  }
}
