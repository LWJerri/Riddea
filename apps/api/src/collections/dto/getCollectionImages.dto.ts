import { IsNumberString } from "class-validator";

export class GetCollectionImagesDto {
  @IsNumberString()
  page: number = 1;

  @IsNumberString()
  limit: number = 20;
}
