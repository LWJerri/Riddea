import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Collection } from "./Collection";

@Entity()
export class Upload {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userID: number;

  @Column("text")
  fileID: string;

  @Column('text', { nullable: true })
  data: string

  @ManyToOne(() => Collection, (collection) => collection.uploads, {
    nullable: true,
    onDelete: "SET NULL",
  })
  collection?: Collection;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
