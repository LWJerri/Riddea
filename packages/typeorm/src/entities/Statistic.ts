import { ApiProperty } from "@nestjs/swagger";
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from "typeorm";

@Entity()
export class Statistic {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  command: string;

  @Column({ nullable: true })
  userID: number;

  @CreateDateColumn()
  createdAt: Date;
}
