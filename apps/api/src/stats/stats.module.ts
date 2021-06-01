import { CacheModule, Module } from "@nestjs/common";
import { ClientsModule, TcpClientOptions, Transport } from "@nestjs/microservices";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Statistic, Upload } from "@riddea/typeorm";
import { resolve } from "path";
import { StatsController } from "./stats.controller";
import { StatsService } from "./stats.service";
import { readFile } from "fs/promises";
import dotenv from "dotenv";
import isDocker from "is-docker";

@Module({
    imports: [
        ClientsModule.registerAsync([
            {
                name: "BOT",
                useFactory: async (): Promise<TcpClientOptions> => {
                    let envFile: dotenv.DotenvParseOutput = null;
                    try {
                        envFile = dotenv.parse(await readFile(resolve(process.cwd(), "..", "bot", ".env"), { encoding: "utf-8" }));
                    } catch {}
                    const port = Number(envFile?.port ?? 3001);
                    return {
                        transport: Transport.TCP,
                        options: {
                            host: isDocker() ? "bot" : process.env.BOT_SERVICE_HOST ?? "localhost",
                            port,
                        },
                    };
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
