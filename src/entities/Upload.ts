import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Upload {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userID: number;

    @Column("text", { array: true })
    storage: string[];
}
