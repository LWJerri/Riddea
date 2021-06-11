import { Collection } from "@riddea/typeorm";
import { PartialType, OmitType } from "@nestjs/swagger";

export class CollectionDTO extends PartialType(OmitType(Collection, ["uploads"] as const)) {}
