import { MigrationInterface, QueryRunner } from "typeorm";

export class newUserData1639768314646 implements MigrationInterface {
  name = "newUserData1639768314646";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" ADD "uploadBan" boolean NOT NULL DEFAULT false`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "uploadBan"`);
  }
}
