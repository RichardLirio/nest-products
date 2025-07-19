import { Module } from "@nestjs/common";
import { ProductsModule } from "./products/products.module";
import { ProductsController } from "./products/products.controller";

@Module({
  imports: [ProductsModule],
  controllers: [ProductsController],
  providers: [],
})
export class AppModule {}
