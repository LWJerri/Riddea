import { ApiProperty } from "@nestjs/swagger";
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Upload } from "./Upload";

@Entity()
export class Collection {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 1000 })
  @Column()
  userID: number;

  @ApiProperty({ example: "Freaky Images" })
  @Column()
  name: string;

  @ApiProperty({ example: Upload, type: () => Upload, isArray: true, required: false })
  @OneToMany(() => Upload, (upload) => upload.collection)
  uploads: Upload[];

  @ApiProperty({ example: true })
  @Column()
  isPublic: boolean;

  @ApiProperty({ example: new Date() })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ example: new Date() })
  @UpdateDateColumn()
  updatedAt: Date;
}
