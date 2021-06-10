import { MigrationInterface, QueryRunner } from "typeorm";

export class dateColumnsUploads1623018289512 implements MigrationInterface {
  name = "dateColumnsUploads1623018289512";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "upload" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
    await queryRunner.query(`ALTER TABLE "upload" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "upload" DROP COLUMN "updatedAt"`);
    await queryRunner.query(`ALTER TABLE "upload" DROP COLUMN "createdAt"`);
  }
}
