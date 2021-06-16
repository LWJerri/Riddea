import { Controller } from "@nestjs/common";
import { MessagePattern } from "@nestjs/microservices";
import { botLogger } from "../helpers/logger";
import { AppService } from "./app.service";

@Controller("app")
export class AppController {
  constructor(private readonly service: AppService) {}

  @MessagePattern({ cmd: "getBotInfo" })
  botInfo() {
    try {
      return this.service.getBotInfo();
    } catch (err) {
      botLogger.error(`App controller error:`, err.stack);
    }
  }

  @MessagePattern({ cmd: "getCommandsUsageList" })
  getCommandUsageList() {
    try {
      return this.service.getCommandUsageList();
    } catch (err) {
      botLogger.error(`App controller error:`, err.stack);
    }
  }
}
