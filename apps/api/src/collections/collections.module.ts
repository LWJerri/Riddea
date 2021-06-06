import { CacheModule, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CollectionsController } from "./collections.controller";
import { CollectionsService } from "./collections.service";
import { Collection } from "@riddea/typeorm";

@Module({
  imports: [
    TypeOrmModule.forFeature([Collection]),
    CacheModule.register({
      ttl: process.env.NODE_ENV === "development" ? 5 : 120,
      max: 1000,
    }),
  ],
  controllers: [CollectionsController],
  providers: [CollectionsService],
})
export class CollectionsModule {}
