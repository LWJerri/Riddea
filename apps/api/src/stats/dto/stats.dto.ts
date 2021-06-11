import { ApiProperty } from "@nestjs/swagger";

export class StatsDTO {
  @ApiProperty({ example: { avatar: 1308, bondage: 243, hentai: 6323, neko: 401, thighs: 71, trap: 66, upload: 29, wallpaper: 133 } })
  commandsUsage: Record<string, number>;

  @ApiProperty({ example: 1 })
  uploads: number;

  @ApiProperty({
    example: { username: "riddea", id: 1234567890, uptime: "26 seconds", version: "2.2.1" },
  })
  botInfo: {
    username: string;
    id: number;
    uptime: string;
    version: string;
  };
}
