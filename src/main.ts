import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Habilitar CORS
  app.enableCors();

  // Swagger/OpenAPI
  const config = new DocumentBuilder()
    .setTitle("Products API")
    .setDescription("API para gerenciamento de produtos")
    .setVersion("1.0")
    .addTag("products")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("docs", app, document);

  await app.listen(3333);

  console.log("🚀 Servidor rodando na porta 3333");
  console.log("📚 Documentação Swagger: http://localhost:3333/docs");
}
bootstrap();
