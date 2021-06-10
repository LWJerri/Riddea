import { ApiProperty } from "@nestjs/swagger";
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Collection } from "./Collection";

@Entity()
export class Upload {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 1234567890 })
  @Column()
  userID: number;

  @ApiProperty({ example: "qwertyuiopasdfghjklzxcvbnm" })
  @Column("text")
  fileID: string;

  @ApiProperty({ example: "data:image/jpeg;base64,/qwertyuiop" })
  @Column("text", { nullable: true })
  data: string;

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
