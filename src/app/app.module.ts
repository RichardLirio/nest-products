import { Module } from "@nestjs/common";
import { ProductsModule } from "../products/products.module";
import { ConfigModule } from "@nestjs/config";
import { envSchema } from "../env";
import { ThrottlerModule } from "@nestjs/throttler";
import { DatabaseModule } from "@/database/database.module";

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000, // 1 min em ms
          limit: 20, // ate 100 requisicoes por minuto por IP/usuario
        },
      ],
    }),
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    ProductsModule,
    DatabaseModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
