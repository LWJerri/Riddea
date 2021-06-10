import { MigrationInterface, QueryRunner } from "typeorm";

export class addUserIDColumn1623326669054 implements MigrationInterface {
  name = "addUserIDColumn1623326669054";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "statistic" ADD "userID" integer NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "statistic" DROP COLUMN "userID"`);
  }
}
