import { PartialType, OmitType, ApiProperty } from "@nestjs/swagger";

import { Collection, Upload } from "../../../entities";
import { UploadsDTO } from "./upload.dto";

export class CollectionDTO extends PartialType(OmitType(Collection, ["uploads"] as const)) {}

export class CollectionUploadsDTO {
  @ApiProperty({ type: Boolean, example: false })
    nextPage: boolean;

  @ApiProperty({ type: UploadsDTO, isArray: true })
    data: Upload & { fileUrl: string }[];
}
