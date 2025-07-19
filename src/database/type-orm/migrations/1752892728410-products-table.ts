import { MigrationInterface, QueryRunner } from "typeorm";

export class ProductsTable1752892728410 implements MigrationInterface {
  name = "ProductsTable1752892728410";

  public async up(queryRunner: QueryRunner): Promise<void> {
    const schema =
      new URL(process.env.DATABASE_URL).searchParams.get("schema") || "public";
    // Verifica se a tabela já existe
    const tableExists = await queryRunner.hasTable(`"${schema}"."products"`);
    if (!tableExists) {
      await queryRunner.query(
        ` CREATE TABLE "${schema}"."products" (
         "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
         "name" text NOT NULL, "price" real NOT NULL,
         "sku" text NOT NULL,
         "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
         "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
         CONSTRAINT "UQ_c44ac33a05b144dd0d9ddcf9327" UNIQUE ("sku"), CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const schema =
      new URL(process.env.DATABASE_URL).searchParams.get("schema") || "public";
    await queryRunner.query(`DROP TABLE IF EXISTS "${schema}"."products"`);
  }
}
