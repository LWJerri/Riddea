import { PartialType, OmitType } from "@nestjs/swagger";

import { Upload } from "../../../entities";

export class UploadsDTO extends PartialType(OmitType(Upload, ["collection"] as const)) {
  fileUrl: string;
}
