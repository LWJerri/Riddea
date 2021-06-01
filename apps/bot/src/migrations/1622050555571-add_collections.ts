import { MigrationInterface, QueryRunner } from "typeorm";

export class addCollections1622050555571 implements MigrationInterface {
    name = "addCollections1622050555571";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE IF NOT EXISTS COLLECTION ("id" SERIAL NOT NULL, "chatID" integer NOT NULL, "name" character varying NOT NULL, "isPublic" boolean NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_ad3f485bbc99d875491f44d7c85" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(`ALTER TABLE "upload" ADD "collectionId" integer`);
        await queryRunner.query(
            `ALTER TABLE "upload" ADD CONSTRAINT "FK_dbe48e91c02b27402e0e623cbed" FOREIGN KEY ("collectionId") REFERENCES "collection"("id") ON DELETE SET NULL ON UPDATE NO ACTION`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "upload" DROP CONSTRAINT "FK_dbe48e91c02b27402e0e623cbed"`);
        await queryRunner.query(`ALTER TABLE "upload" DROP COLUMN "collectionId"`);
        await queryRunner.query(`DROP TABLE "collection"`);
    }
}
