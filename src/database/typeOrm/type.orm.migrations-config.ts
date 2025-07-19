import { DataSource, DataSourceOptions } from "typeorm";
import "dotenv/config";
import { Product } from "@/products/entities/product.entity";

const url = new URL(process.env.DATABASE_URL);
const schema = url.searchParams.get("schema") || "public"; // Extrai o schema da URL

const dataSourceOptions: DataSourceOptions = {
  type: "postgres",
  url: process.env.DATABASE_URL,
  schema,
  ssl: false, // Necessário para conexões externas
  entities: [Product],
  migrations: [__dirname + "/migrations/*.ts"],
  synchronize: false,
  migrationsTableName: "migrations",
};

export const appDataSource = new DataSource(dataSourceOptions);
