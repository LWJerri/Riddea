import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Upload {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userID: number;

    @Column("text")
    fileID: string;
}
