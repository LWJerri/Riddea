import { MigrationInterface, QueryRunner } from "typeorm";

export class AllDataV21621872946251 implements MigrationInterface {
    name = "AllDataV21621872946251";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE IF NOT EXISTS STATISTIC ("id" SERIAL NOT NULL, "avatarUsed" integer NOT NULL DEFAULT '0', "bondageUsed" integer NOT NULL DEFAULT '0', "hentaiUsed" integer NOT NULL DEFAULT '0', "nekoUsed" integer NOT NULL DEFAULT '0', "thighsUsed" integer NOT NULL DEFAULT '0', "trapUsed" integer NOT NULL DEFAULT '0', "uploadUsed" integer NOT NULL DEFAULT '0', "wallpaperUsed" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_e3e6fd496e1988019d8a46749ae" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `CREATE TABLE IF NOT EXISTS UPLOAD ("id" SERIAL NOT NULL, "userID" integer NOT NULL, "fileID" text NOT NULL, CONSTRAINT "PK_1fe8db121b3de4ddfa677fc51f3" PRIMARY KEY ("id"))`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "upload"`);
        await queryRunner.query(`DROP TABLE "statistic"`);
    }
}
