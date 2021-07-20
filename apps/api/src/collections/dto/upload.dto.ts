import { Upload } from "@riddea/typeorm";
import { PartialType, OmitType } from "@nestjs/swagger";

export class UploadsDTO extends PartialType(OmitType(Upload, ["collection"] as const)) {
  fileUrl: string;
}
