import { IsNumberString } from "class-validator";

export class GetCollectionImages {
  @IsNumberString()
  page: number = 1;

  @IsNumberString()
  limit: number = 20;
}
