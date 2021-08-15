import { ApiProperty } from "@nestjs/swagger";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  AfterInsert,
  AfterLoad,
  AfterUpdate,
} from "typeorm";

import { Collection } from "./Collection";

@Entity()
export class Upload {
  @ApiProperty({ example: 1000 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 1000 })
  @Column()
  userID: number;

  @ApiProperty({ example: "qwerty123" })
  @Column("text")
  fileID: string;

  @ApiProperty({ example: "coolImage.jpg" })
  @Column("varchar", { nullable: true })
  fileName: string;

  filePath?: string;

  @AfterLoad()
  @AfterInsert()
  @AfterUpdate()
  generateMainPath(): void {
    this.filePath = `${this.userID}/${this.fileName}`;
  }

  @ApiProperty({ example: Collection, type: () => Collection })
  @ManyToOne(() => Collection, (collection) => collection.uploads, {
    nullable: true,
    onDelete: "SET NULL",
  })
  collection?: Collection;

  @ApiProperty({ example: new Date() })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ example: new Date() })
  @UpdateDateColumn()
  updatedAt: Date;
}
