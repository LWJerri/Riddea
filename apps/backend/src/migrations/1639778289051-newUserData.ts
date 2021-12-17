import { MigrationInterface, QueryRunner } from "typeorm";

export class newUserData1639778289051 implements MigrationInterface {
  name = "newUserData1639778289051";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "uploadBan" DROP NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "uploadBan" SET NOT NULL`);
  }
}
