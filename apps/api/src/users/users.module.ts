import { CacheModule, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Collection } from "@riddea/typeorm";
import { CollectionsService } from "src/collections/collections.service";
import { UsersController } from "./users.controller";

@Module({
    imports: [
        TypeOrmModule.forFeature([Collection]),
        CacheModule.register({
            ttl: process.env.NODE_ENV === "development" ? 5 : 120,
            max: 1000,
        }),
    ],
    controllers: [UsersController],
    providers: [CollectionsService],
})
export class UsersModule {}
