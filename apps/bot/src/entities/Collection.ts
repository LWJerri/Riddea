import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Upload } from "./Upload";

@Entity()
export class Collection {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userID: number;

    @Column()
    name: string;

    @OneToMany(() => Upload, (upload) => upload.collection)
    uploads: Upload[];

    @Column()
    isPublic: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
