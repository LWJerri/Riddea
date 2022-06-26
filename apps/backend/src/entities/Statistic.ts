import { ApiProperty } from "@nestjs/swagger";
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from "typeorm";

@Entity()
export class Statistic {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
    id: number;

  @ApiProperty({ example: "stats" })
  @Column()
    command: string;

  @ApiProperty({ example: "0123456789" })
  @Column({ nullable: true })
    userID: number;

  @ApiProperty({ example: new Date() })
  @CreateDateColumn()
    createdAt: Date;
}
