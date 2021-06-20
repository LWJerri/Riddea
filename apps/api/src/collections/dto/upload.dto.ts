import { PartialType, OmitType } from "@nestjs/swagger";
import { Upload } from "@prisma/client";

class U implements Upload {
  id: number;
  userID: number;
  fileID: string;
  collectionId: number;
  createdAt: Date;
  updatedAt: Date;
  data: string;
}

export class UploadsDTO extends PartialType(U) {}
