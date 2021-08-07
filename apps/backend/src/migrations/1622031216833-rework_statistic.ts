import { MigrationInterface, QueryRunner } from "typeorm";

export class reworkStatistic1622031216833 implements MigrationInterface {
  name = "reworkStatistic1622031216833";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "statistic" DROP COLUMN "avatarUsed"`);
    await queryRunner.query(`ALTER TABLE "statistic" DROP COLUMN "bondageUsed"`);
    await queryRunner.query(`ALTER TABLE "statistic" DROP COLUMN "hentaiUsed"`);
    await queryRunner.query(`ALTER TABLE "statistic" DROP COLUMN "nekoUsed"`);
    await queryRunner.query(`ALTER TABLE "statistic" DROP COLUMN "thighsUsed"`);
    await queryRunner.query(`ALTER TABLE "statistic" DROP COLUMN "trapUsed"`);
    await queryRunner.query(`ALTER TABLE "statistic" DROP COLUMN "uploadUsed"`);
    await queryRunner.query(`ALTER TABLE "statistic" DROP COLUMN "wallpaperUsed"`);
    await queryRunner.query(`ALTER TABLE "statistic" ADD "command" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "statistic" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "statistic" DROP COLUMN "createdAt"`);
    await queryRunner.query(`ALTER TABLE "statistic" DROP COLUMN "command"`);
    await queryRunner.query(`ALTER TABLE "statistic" ADD "wallpaperUsed" integer NOT NULL DEFAULT '0'`);
    await queryRunner.query(`ALTER TABLE "statistic" ADD "uploadUsed" integer NOT NULL DEFAULT '0'`);
    await queryRunner.query(`ALTER TABLE "statistic" ADD "trapUsed" integer NOT NULL DEFAULT '0'`);
    await queryRunner.query(`ALTER TABLE "statistic" ADD "thighsUsed" integer NOT NULL DEFAULT '0'`);
    await queryRunner.query(`ALTER TABLE "statistic" ADD "nekoUsed" integer NOT NULL DEFAULT '0'`);
    await queryRunner.query(`ALTER TABLE "statistic" ADD "hentaiUsed" integer NOT NULL DEFAULT '0'`);
    await queryRunner.query(`ALTER TABLE "statistic" ADD "bondageUsed" integer NOT NULL DEFAULT '0'`);
    await queryRunner.query(`ALTER TABLE "statistic" ADD "avatarUsed" integer NOT NULL DEFAULT '0'`);
  }
}
