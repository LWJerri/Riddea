import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Settings {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    avatarUsed: number;

    @Column()
    wallpaperUsed: number;

    @Column()
    bondageUsed: number;

    @Column()
    hentaiUsed: number;

    @Column()
    thighsUsed: number;

    @Column()
    uploadUsed: number;
}
