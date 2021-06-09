import {MigrationInterface, QueryRunner} from "typeorm";

export class uploadsDataColumn1623266886877 implements MigrationInterface {
    name = 'uploadsDataColumn1623266886877'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "upload" ADD "data" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "upload" DROP COLUMN "data"`);
    }

}
