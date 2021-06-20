import { PartialType, ApiProperty } from "@nestjs/swagger";
import { UploadsDTO } from "./upload.dto";
import { Collection, Upload } from "@prisma/client";

export class Col implements Collection {
  id: number;
  userID: number;
  name: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class CollectionDTO extends PartialType(Col) {}

export class CollectionUploadsDTO {
  @ApiProperty({ type: Boolean, example: false })
  nextPage: boolean;

  @ApiProperty({ type: UploadsDTO, isArray: true })
  data: Upload[];
}
