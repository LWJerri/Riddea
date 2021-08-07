import { Upload } from "../../../entities";
import { PartialType, OmitType } from "@nestjs/swagger";

export class UploadsDTO extends PartialType(OmitType(Upload, ["collection"] as const)) {
  fileUrl: string;
}
