import {MigrationInterface, QueryRunner} from "typeorm";

export class uniqueUserID1628971490885 implements MigrationInterface {
    name = 'uniqueUserID1628971490885'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."user" ADD CONSTRAINT "UQ_46d78688eda2476cb18f7eae8a5" UNIQUE ("userID")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."user" DROP CONSTRAINT "UQ_46d78688eda2476cb18f7eae8a5"`);
    }

}
