import { MigrationInterface, QueryRunner } from "typeorm";

export class uploadBan1639840938239 implements MigrationInterface {
  name = "uploadBan1639840938239";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" ADD "uploadBan" boolean DEFAULT false`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "uploadBan"`);
  }
}
