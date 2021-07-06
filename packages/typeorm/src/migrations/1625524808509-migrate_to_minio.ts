import {MigrationInterface, QueryRunner} from "typeorm";

export class migrateToMinio1625524808509 implements MigrationInterface {
    name = 'migrateToMinio1625524808509'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_4c1989542e47d9e3b98fe32c67"`);
        await queryRunner.query(`ALTER TABLE "upload" RENAME COLUMN "data" TO "fileName"`);
        await queryRunner.query(`ALTER TABLE "upload" DROP COLUMN "fileName"`);
        await queryRunner.query(`ALTER TABLE "upload" ADD "fileName" character varying`);
        await queryRunner.query(`ALTER TABLE "sessions" DROP COLUMN "expireAt"`);
        await queryRunner.query(`ALTER TABLE "sessions" ADD "expireAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`CREATE INDEX "IDX_23b879ac118a273f7d4510cc6d" ON "sessions" ("expireAt") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_23b879ac118a273f7d4510cc6d"`);
        await queryRunner.query(`ALTER TABLE "sessions" DROP COLUMN "expireAt"`);
        await queryRunner.query(`ALTER TABLE "sessions" ADD "expireAt" bigint`);
        await queryRunner.query(`ALTER TABLE "upload" DROP COLUMN "fileName"`);
        await queryRunner.query(`ALTER TABLE "upload" ADD "fileName" text`);
        await queryRunner.query(`ALTER TABLE "upload" RENAME COLUMN "fileName" TO "data"`);
        await queryRunner.query(`CREATE INDEX "IDX_4c1989542e47d9e3b98fe32c67" ON "sessions" ("expireAt") `);
    }

}
