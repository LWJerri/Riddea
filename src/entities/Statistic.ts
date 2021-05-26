import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Statistic {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    command: string;

    @CreateDateColumn()
    createdAt: Date;
}
