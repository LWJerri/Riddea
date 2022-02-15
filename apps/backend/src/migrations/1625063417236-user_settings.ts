import { MigrationInterface, QueryRunner } from "typeorm";

export class userSettings1625063417236 implements MigrationInterface {
  name = "userSettings1625063417236";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user" ("id" SERIAL NOT NULL, "uploadBan" boolean DEFAULT false, "userID" integer NOT NULL, "lang" character varying NOT NULL, "startedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")),`,
    );
    await queryRunner.query(`ALTER TABLE "sessions" ALTER COLUMN "expireAt" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "sessions" ALTER COLUMN "expireAt" SET DEFAULT '1625063417837'`);
    await queryRunner.query(`CREATE INDEX "IDX_23b879ac118a273f7d4510cc6d" ON "sessions" ("expireAt") `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_23b879ac118a273f7d4510cc6d"`);
    await queryRunner.query(`ALTER TABLE "sessions" ALTER COLUMN "expireAt" DROP DEFAULT`);
    await queryRunner.query(`ALTER TABLE "sessions" ALTER COLUMN "expireAt" DROP NOT NULL`);
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
