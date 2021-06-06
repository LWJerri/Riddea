import { MigrationInterface, QueryRunner } from "typeorm";

export class renameChatID1622116554636 implements MigrationInterface {
  name = "renameChatID1622116554636";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "collection" RENAME COLUMN "chatID" TO "userID"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "collection" RENAME COLUMN "userID" TO "chatID"`);
  }
}
