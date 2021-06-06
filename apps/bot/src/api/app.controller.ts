import { Controller } from "@nestjs/common";
import { MessagePattern } from "@nestjs/microservices";
import { AppService } from "./app.service";

@Controller("app")
export class AppController {
    constructor(private readonly service: AppService) {}

    @MessagePattern({ cmd: "getBotInfo" })
    botInfo() {
        return this.service.getBotInfo();
    }

    @MessagePattern({ cmd: "getCommandsUsageList" })
    getCommandUsageList() {
        return this.service.getCommandUsageList();
    }
}
