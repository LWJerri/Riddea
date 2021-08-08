import { MigrationInterface, QueryRunner, IsNull } from "typeorm";

export class defaultCollections1628428754570 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const users: any[] = await queryRunner.manager.getRepository("user").find();

    const collectionsRepository = queryRunner.manager.getRepository("collection");
    const uploadRepository = queryRunner.manager.getRepository("upload");

    for (const user of users) {
      const collection: any = await collectionsRepository.save({ name: "IWC", userID: user.userID, isPublic: false });
      await uploadRepository.update({ userID: user.userID, collection: IsNull() }, { collection: collection.id });
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
