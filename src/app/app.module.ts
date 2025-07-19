import { Module } from "@nestjs/common";
import { ProductsModule } from "../products/products.module";
import { ProductsController } from "../products/products.controller";
import { ConfigModule } from "@nestjs/config";
import { envSchema } from "../env";

@Module({
  imports: [
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
