import { CacheModule, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Collection, Upload } from "../../entities";
import { CollectionsController } from "./collections.controller";
import { CollectionsService } from "./collections.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Collection, Upload]),
    CacheModule.register({
      ttl: process.env.NODE_ENV === "production" ? 120 : 5,
      max: 1000,
    }),
  ],
  controllers: [CollectionsController],
  providers: [CollectionsService],
})
export class CollectionsModule {}
