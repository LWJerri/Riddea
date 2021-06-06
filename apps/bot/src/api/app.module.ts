import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import * as typeOrmEntities from "@riddea/typeorm";
import { getConnectionOptions } from "typeorm";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async () => ({
        ...(await getConnectionOptions()),
        name: "microservice",
        entities: Object.values(typeOrmEntities),
      }),
    }),
    TypeOrmModule.forFeature(Object.values(typeOrmEntities)),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
