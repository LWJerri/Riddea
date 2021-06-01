import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Collection } from "./Collection";

@Entity()
export class Upload {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userID: number;

    @Column("text")
    fileID: string;

    @ManyToOne(() => Collection, (collection) => collection.uploads, {
        nullable: true,
        onDelete: "SET NULL",
    })
    collection?: Collection;
}
