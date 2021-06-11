import { ApiProperty } from "@nestjs/swagger";
import { IsNumberString } from "class-validator";

export class GetCollectionImages {
  @ApiProperty()
  @IsNumberString()
  page: number = 1;

  @ApiProperty()
  @IsNumberString()
  limit: number = 20;
}
