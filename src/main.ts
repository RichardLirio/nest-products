import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app/app.module";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { Env } from "./env";
import { ConfigService } from "@nestjs/config";
import helmet from "helmet";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Segurança: Cria headers http para segurança da api
  app.use(helmet());

  const configService = app.get<ConfigService<Env>>(ConfigService); // criando instacia do config service
  const port = configService.get("PORT", { infer: true });

  // Definindo prefixo da versão da api
  const apiVersion: string = configService.getOrThrow("VERSION");
  app.setGlobalPrefix(`api/v${apiVersion}`);

  const allowedOrigins: string[] = configService
    .getOrThrow("CORS_ALLOWED_ORIGINS")
    .split(",");

  // Habilitar CORS
  app.enableCors({
    origin: allowedOrigins,
  });

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

  console.log(`🚀 Servidor rodando na porta ${port}`);
  console.log(`📚 Documentação Swagger: http://localhost:${port}/docs`);
}
bootstrap();
