import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  userID: number;

  @Column()
  lang: string;

  @CreateDateColumn()
  startedAt: Date;
}
