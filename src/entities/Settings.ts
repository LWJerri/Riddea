import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Settings {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("int", { default: 0 })
    avatarUsed: number;

    @Column("int", { default: 0 })
    bondageUsed: number;

    @Column("int", { default: 0 })
    hentaiUsed: number;

    @Column("int", { default: 0 })
    nekoUsed: number;

    @Column("int", { default: 0 })
    thighsUsed: number;

    @Column("int", { default: 0 })
    trapUsed: number;

    @Column("int", { default: 0 })
    uploadUsed: number;

    @Column("int", { default: 0 })
    wallpaperUsed: number;
}
