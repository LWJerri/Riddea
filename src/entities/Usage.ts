import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity({
  name: 'usages'
})
export class Usage {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    command: string;

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}
