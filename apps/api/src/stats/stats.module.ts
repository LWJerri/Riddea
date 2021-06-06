import { CacheModule, Module } from "@nestjs/common";
import { ClientsModule } from "@nestjs/microservices";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Statistic, Upload } from "@riddea/typeorm";
import { StatsController } from "./stats.controller";
import { StatsService } from "./stats.service";
import isDocker from "is-docker";

@Module({
    imports: [
        ClientsModule.register([
            {
                name: "BOT",
                options: {
                    host: isDocker() ? "bot" : process.env.BOT_SERVICE_HOST ?? "localhost",
                    port: Number(process.env.BOT_PORT ?? 3001),
                },
            },
        ]),
        TypeOrmModule.forFeature([Statistic, Upload]),
        CacheModule.register({
            ttl: process.env.NODE_ENV === "development" ? 5 : 120,
            max: 1000,
        }),
    ],
    controllers: [StatsController],
    providers: [StatsService],
})
export class StatsModule {}
