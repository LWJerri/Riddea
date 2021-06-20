import { CacheModule, Module } from "@nestjs/common";
import { CollectionsService } from "../collections/collections.service";
import { MicroserviceModule } from "../microservice.module";
import { UsersController } from "./users.controller";

@Module({
  imports: [
    MicroserviceModule,
    CacheModule.register({
      ttl: process.env.NODE_ENV === "production" ? 120 : 5,
      max: 1000,
    }),
  ],
  controllers: [UsersController],
  providers: [CollectionsService],
})
export class UsersModule {}
