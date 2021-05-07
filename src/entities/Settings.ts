import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Settings {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    avatarUsed: number;

    @Column()
    bondageUsed: number;

    @Column()
    hentaiUsed: number;

    @Column()
    nekoUsed: number;

    @Column()
    thighsUsed: number;

    @Column()
    trapUsed: number;

    @Column()
    uploadUsed: number;

    @Column()
    wallpaperUsed: number;
}
