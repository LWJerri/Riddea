import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Settings {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: 0 })
    avatarUsed: number;

    @Column({ default: 0 })
    bondageUsed: number;

    @Column({ default: 0 })
    hentaiUsed: number;

    @Column({ default: 0 })
    nekoUsed: number;

    @Column({ default: 0 })
    thighsUsed: number;

    @Column({ default: 0 })
    trapUsed: number;

    @Column({ default: 0 })
    uploadUsed: number;

    @Column({ default: 0 })
    wallpaperUsed: number;
}
