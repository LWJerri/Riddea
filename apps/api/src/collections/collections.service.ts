import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Collection } from "@riddea/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class CollectionsService {
  constructor(@InjectRepository(Collection) private collectionRepository: Repository<Collection>) {}

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
}
