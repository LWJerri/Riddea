import { CacheModule, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CollectionsController } from "./collections.controller";
import { CollectionsService } from "./collections.service";
import { Collection, Upload } from "@riddea/typeorm";
import { MicroserviceModule } from "../microservice.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Collection, Upload]),
    CacheModule.register({
      ttl: process.env.NODE_ENV === "production" ? 120 : 5,
      max: 1000,
    }),
    MicroserviceModule,
  ],
  controllers: [CollectionsController],
  providers: [CollectionsService],
})
export class CollectionsModule {}
