import { Module } from "@nestjs/common";
import { ProductsModule } from "../products/products.module";
import { ProductsController } from "../products/products.controller";
import { ConfigModule } from "@nestjs/config";
import { envSchema } from "../env";
import { ThrottlerModule } from "@nestjs/throttler";

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
  ],
  controllers: [ProductsController],
  providers: [],
})
export class AppModule {}
