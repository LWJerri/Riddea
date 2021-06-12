import { CacheModule, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Collection, Upload } from "@riddea/typeorm";
import { CollectionsService } from "../collections/collections.service";
import { MicroserviceModule } from "../microservice.module";
import { UsersController } from "./users.controller";

@Module({
  imports: [
    MicroserviceModule,
    TypeOrmModule.forFeature([Collection, Upload]),
    CacheModule.register({
      ttl: process.env.NODE_ENV === "production" ? 120 : 5,
      max: 1000,
    }),
  ],
  controllers: [UsersController],
  providers: [CollectionsService],
})
export class UsersModule {}
