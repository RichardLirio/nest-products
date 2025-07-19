import { Env } from "@/env";
import { Product } from "@/products/entities/product.entity";
import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService<Env, true>) => {
        const url = new URL(config.get("DATABASE_URL", { infer: true }));
        const schema = url.searchParams.get("schema") || "public"; // Extrai o schema da URL
        return {
          type: "postgres",
          url: config.get("DATABASE_URL", { infer: true }),
          ssl: false, // Necessário para conexões externas
          schema, // Define o schema explicitamente
          entities: [Product],
          migrations: [__dirname + "/migrations/*.ts"],
          synchronize: false, // Desativei para não criar as tabelas atraves das entidades automaticamente
          migrationsRun: false, // Evita rodar migrações automaticamente
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
