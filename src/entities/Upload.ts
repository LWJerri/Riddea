import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Upload {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    chatID: number;

    @Column("text")
    data: string;
}
