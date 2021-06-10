import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from "typeorm";

@Entity()
export class Statistic {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  command: string;

  @Column({ nullable: true })
  userID: number;

  @CreateDateColumn()
  createdAt: Date;
}
