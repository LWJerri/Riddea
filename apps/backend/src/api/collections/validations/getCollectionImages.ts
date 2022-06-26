import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { Max, Min } from "class-validator";

export class GetCollectionImages {
  @ApiProperty()
  @Min(1)
  @Type(() => Number)
    page: number = 1;

  @ApiProperty()
  @Min(1)
  @Max(100)
  @Type(() => Number)
    limit: number = 100;
}
