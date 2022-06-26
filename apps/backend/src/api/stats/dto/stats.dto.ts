import { ApiProperty } from "@nestjs/swagger";

export class StatsDTO {
  @ApiProperty({ example: { avatar: 0, bondage: 0, hentai: 0, neko: 0, thighs: 0, trap: 0, upload: 0, wallpaper: 0 } })
    commandsUsage: Record<string, number>;

  @ApiProperty({ example: 1 })
    uploads: number;

  @ApiProperty({
    example: { username: "username", id: 123456, uptime: "1 second", version: "0.0.1" },
  })
    botInfo: {
    username: string;
    id: number;
    uptime: string;
    version: string;
  };
}
