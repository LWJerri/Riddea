import { MigrationInterface, QueryRunner } from "typeorm";

export class addSessions1623493031340 implements MigrationInterface {
  name = "addSessions1623493031340";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "sessions" ("id" SERIAL NOT NULL, "expireAt" bigint, "sid" character varying NOT NULL, "json" text NOT NULL, CONSTRAINT "PK_3238ef96f18b355b671619111bc" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_4c1989542e47d9e3b98fe32c67" ON "sessions" ("expireAt") `);
    await queryRunner.query(`CREATE INDEX "IDX_e2d6172ca19b8ebef797c362b0" ON "sessions" ("sid") `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_e2d6172ca19b8ebef797c362b0"`);
    await queryRunner.query(`DROP INDEX "IDX_4c1989542e47d9e3b98fe32c67"`);
    await queryRunner.query(`DROP TABLE "sessions"`);
  }
}
