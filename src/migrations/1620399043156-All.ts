import {MigrationInterface, QueryRunner} from "typeorm";

export class All1620399043156 implements MigrationInterface {
    name = 'All1620399043156'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "settings" ("id" SERIAL NOT NULL, "avatarUsed" integer NOT NULL DEFAULT '0', "bondageUsed" integer NOT NULL DEFAULT '0', "hentaiUsed" integer NOT NULL DEFAULT '0', "nekoUsed" integer NOT NULL DEFAULT '0', "thighsUsed" integer NOT NULL DEFAULT '0', "trapUsed" integer NOT NULL DEFAULT '0', "uploadUsed" integer NOT NULL DEFAULT '0', "wallpaperUsed" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_0669fe20e252eb692bf4d344975" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "upload" ("id" SERIAL NOT NULL, "userID" integer NOT NULL, "storage" text array NOT NULL, CONSTRAINT "PK_1fe8db121b3de4ddfa677fc51f3" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "upload"`);
        await queryRunner.query(`DROP TABLE "settings"`);
    }

}
