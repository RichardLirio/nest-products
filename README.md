# 🏪 NestJS Products API

![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-10.0+-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED?style=for-the-badge&logo=docker&logoColor=white)

![License](https://img.shields.io/github/license/RichardLirio/nest-products?style=for-the-badge)
![GitHub Actions](https://img.shields.io/github/actions/workflow/status/RichardLirio/nest-products/run-e2e-tests.yml?style=for-the-badge&logo=github-actions&logoColor=white&label=CI/CD)
![Code Coverage](https://img.shields.io/badge/Coverage-95%25+-4FC08D?style=for-the-badge&logo=vitest&logoColor=white)
![API Version](https://img.shields.io/badge/API-v1.0-FF6B6B?style=for-the-badge)

![Security](https://img.shields.io/badge/Security-Helmet%20%2B%20Rate%20Limiting-FF6B35?style=for-the-badge&logo=shield&logoColor=white)
![Swagger](https://img.shields.io/badge/API%20Docs-Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)
![ESLint](https://img.shields.io/badge/Code%20Quality-ESLint%20%2B%20Prettier-4B32C3?style=for-the-badge&logo=eslint&logoColor=white)


> Uma API RESTful para gerenciamento de produtos desenvolvida com NestJS, TypeORM e implementando um algoritmo específico para busca de letras faltantes em produtos.

## 🚀 Características Principais

- **Framework**: NestJS com TypeScript
- **ORM**: TypeORM para gerenciamento de banco de dados
- **Segurança**: Helmet, Rate Limiting e CORS configurados
- **Qualidade de Código**: ESLint + Husky + Commitlint
- **Testes**: Testes E2E com Vitest
- **Documentação**: Swagger/OpenAPI
- **DevOps**: Dockerização e CI/CD com GitHub Actions
- **Algoritmo Personalizado**: Busca de primeira letra faltante

## 📋 Pré-requisitos

- Node.js (versão 18 ou superior)
- npm
- Docker (para containerização)

## 🛠️ Instalação

```bash
# Clone o repositório
git clone https://github.com/RichardLirio/nest-products.git

# Navegue até o diretório
cd nest-products

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
```

## ⚙️ Configuração de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Database
DATABASE_USER=root
DATABASE_PASSWORD=randompassword
DATABASE_DB=mydb
DATABASE_URL=postgresql://root:randompassword@localhost:5432/mydb?schema=public

# Application
PORT=3333

# Cors
CORS_ALLOWED_ORIGINS=http://localhost:3333,http://localhost:5173
```

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm start:dev          # Inicia em modo de desenvolvimento com hot reload
npm start              # Inicia em modo padrão
npm start:prod         # Inicia em modo de produção

# Testes
npm test:e2e           # Executa testes end-to-end
npm test:cov           # Gera relatório de cobertura

# Migrations
npm migration:generate # Gera nova migration
npm migration:run      # Executa migrations pendentes
npm migration:revert   # Reverte última migration

# Qualidade de código
npm lint               # Executa ESLint
npm lint:fix           # Corrige problemas do ESLint automaticamente
npm format             # Formata código com Prettier
```

## 🏗️ Estrutura do Projeto

```
├── src
    ├── app.module.ts
    ├── database
    │   ├── database.module.ts
    │   └── type-orm
    │   │   ├── migrations
    │   │       └── 1752892728410-products-table.ts
    │   │   └── type.orm.migrations-config.ts
    ├── env.ts
    ├── main.ts
    ├── pipes
    │   └── zod-validation-pipe.ts
    └── products
    │   ├── dto
    │       ├── create.products.dto.ts
    │       ├── create.products.swagger.dto.ts
    │       ├── product-response.dto.ts
    │       ├── query.products.dto.ts
    │       ├── update.products.dto.ts
    │       └── update.products.swagger.dto.ts
    │   ├── entities
    │       └── product.entity.ts
    │   ├── products.controller.ts
    │   ├── products.module.ts
    │   └── products.service.ts
├── test
    ├── create.product.e2e.spec.ts
    ├── delete.product.e2e.spec.ts
    ├── fetch.products.e2e.spec.ts
    ├── get.product.e2e.spec.ts
    ├── setup-e2e.ts
    └── update.product.e2e.spec.ts
├── .env.example
├── .github
    └── workflows
    │   └── run-e2e-tests.yml
├── .gitignore
├── .husky
    ├── commit-msg
    └── pre-commit
├── LICENSE
├── README.md
├── commitlint.config.js
├── docker-compose.yml
├── eslint.config.mjs
├── nest-cli.json
├── package-lock.json
├── package.json
├── tsconfig.build.json
├── tsconfig.json
└── vitest.config.mtso
```

## 🔐 Segurança Implementada

### Helmet
O [Helmet](https://helmetjs.github.io/) é utilizado para definir cabeçalhos de segurança HTTP:

```typescript
import helmet from 'helmet';

app.use(helmet());
```

**Função**: Protege a aplicação definindo vários cabeçalhos HTTP de segurança, incluindo:
- `X-Content-Type-Options`
- `X-Frame-Options` 
- `X-XSS-Protection`
- `Strict-Transport-Security`

### Rate Limiting
Implementa limitação de taxa para prevenir ataques de força bruta:

```typescript
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60000, // 1 min em ms
      limit: 20, // ate 100 requisicoes por minuto por IP/usuario
    }),
  ],
})
```

**Função**: Impede que um cliente faça muitas requisições em um curto período de tempo.

### CORS
Configuração de Cross-Origin Resource Sharing para controlar acesso:

```typescript
app.enableCors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
});
```

**Função**: Define quais origens podem acessar a API, aumentando a segurança.

## 🧮 Algoritmo de Busca de Letra Faltante

Este projeto implementa um algoritmo para encontrar a primeira letra faltante em uma sequência:

### Conceito do Algoritmo

```typescript
private findFirstMissingLetter(name: string): string {
  const normalizedName = name.toLowerCase().replace(/[^a-z]/g, "");
  const presentLetters = new Set(normalizedName);

  for (let i = 0; i < 26; i++) {
    const letter = String.fromCharCode(97 + i); // 'a' = 97
    if (!presentLetters.has(letter)) {
      return letter;
    }
  }

  return "_"; // Todas as letras estão presentes
}
```

### Explicações Técnicas

**1. `new Set()`**: 
- Cria uma estrutura de dados que armazena valores únicos
- Permite verificação O(1) para existência de elementos
- Remove duplicatas automaticamente

```typescript
const letters = "abcdfg";
const normalizedName = letters.toLowerCase().replace(/[^a-z]/g, "");
const presentLetters = new Set(normalizedName);
// Set { 'a', 'b', 'c', 'd', 'f', 'g' }
```

**2. Tabela CharCode ASCII**:
- Caracteres são representados por códigos numéricos
- 'a' = 97, 'b' = 98, ..., 'z' = 122

| Letra | Código ASCII |
|-------|-------------|
| a     | 97          |
| b     | 98          |
| c     | 99          |
| ...   | ...         |
| z     | 122         |

**3. `String.fromCharCode()`**:
```typescript
String.fromCharCode(97); // retorna 'a'
String.fromCharCode(98); // retorna 'b'
```

**4. Operador `!` (NOT)**:
```typescript
presentLetters.has('e'); // true se 'e' existe no set
!presentLetters.has('e'); // false se 'e' existe (inverte o booleano)
```

O `!` inverte o resultado booleano para identificar quando uma letra NÃO está presente.

### Exemplo Prático

```typescript
// Entrada: "abcdfg"
// Processo:
// - Verifica 'a': presente ✓
// - Verifica 'b': presente ✓  
// - Verifica 'c': presente ✓
// - Verifica 'd': presente ✓
// - Verifica 'e': AUSENTE ❌
// Resultado: 'e'
```

## 📊 Função Enrich

A função `enrich` foi criada separadamente para ser reutilizada em todos os retornos da entidade Product:

```typescript
private enrichProduct(product: Product): Product {
  return {
    ...product,
    first_missing_letter: this.findFirstMissingLetter(product.name),
  };
}
```

**Vantagens**:
- Reutilização de código
- Padronização dos dados de resposta
- Facilita manutenção e testes
- Separação de responsabilidades

## 🗄️ Migrations do TypeORM

### Configuração Personalizada

Devido às limitações mencionadas na documentação oficial do NestJS sobre migrations:

> *"Migration classes are separate from the Nest application source code. Their lifecycle is maintained by the TypeORM CLI. Therefore, you are not able to leverage dependency injection and other Nest specific features with migrations."*

Foi necessário criar um arquivo de configuração separado (`type.orm.migrations-config.ts`) e scripts personalizados:

```typescript
// src/database/type-orm/type.orm.migrations-config.ts
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
```

### Scripts Personalizados

```json
{
  "scripts": {
   "migration:create": "npm run typeorm migration:create ./src/database/type-orm/migrations/%npm_config_name%",
    "migration:run": "npm run typeorm migration:run -- -d ./src/database/type-orm/type.orm.migrations-config.ts",
    "migration:revert": "npm run typeorm migration:revert -- -d ./src/database/type-orm/type.orm.migrations-config.ts",
    "migration:generate": "npm run typeorm -- migration:generate ./src/database/type-orm/migrations/%npm_config_name% -d ./src/database/type-orm/type.orm.migrations-config.ts"
  }
}
```

## 🧪 Testes

### Testes E2E com Vitest

```typescript
// test/get.product.e2e.spec.ts
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { AppModule } from "@/app.module";
import request from "supertest";
import { Repository } from "typeorm";
import { getRepositoryToken } from "@nestjs/typeorm";
import {
  cleanupTableProductsDatabase,
  cleanupTestDatabase,
  setupTestDatabase,
} from "test/setup-e2e";
import { Product } from "@/products/entities/product.entity";

describe("Get Products (E2E)", () => {
  let app: INestApplication;
  let productRepository: Repository<Product>;

  beforeAll(async () => {
    await setupTestDatabase();
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    productRepository = moduleRef.get<Repository<Product>>(
      getRepositoryToken(Product)
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
    await cleanupTestDatabase();
  });

  beforeEach(async () => {
    await cleanupTableProductsDatabase();
  });

  // Função para criar produto no banco de dados
  async function createProduct(name: string, price: number, sku: string) {
    return await productRepository.save({
      name,
      price,
      sku,
    });
  }

  it("[GET] /api/v1/product/:id - Deve ser possivel buscar o produto pelo ID", async () => {
    const product = await createProduct(
      "Notebook Dell Inspiron 15",
      2599.99,
      "DELL-NB-001"
    );

    const response = await request(app.getHttpServer()).get(
      `/products/${product.id}`
    );

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: "Notebook Dell Inspiron 15",
        price: 2599.99,
        sku: "DELL-NB-001",
        first_missing_letter: "a",
        created_at: expect.any(String),
        updated_at: expect.any(String),
      })
    );
  });
});

```

## 📖 Documentação API

A documentação da API está disponível via Swagger:

- **Desenvolvimento**: `http://localhost:3333/docs`
- **Produção**: `https://sua-api.com/docs`

### Exemplo de Configuração Swagger

```typescript
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

// Swagger/OpenAPI
const config = new DocumentBuilder()
  .setTitle("Products API")
  .setDescription("API para gerenciamento de produtos")
  .setVersion("1.0")
  .addTag("products")
  .build();
const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup("docs", app, document);
```

## 🐳 Docker

### Dockerfile

```dockerfile
FROM node:22.17.0-alpine AS base

RUN apk add --no-cache dumb-init postgresql-client

RUN addgroup -g 1001 -S nodejs
RUN adduser -S productsapp -u 1001

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./

COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

ENTRYPOINT ["docker-entrypoint.sh"]

# --- Stage para desenvolvimento ---
FROM base AS development

RUN npm ci --include=dev

COPY . .

RUN chown -R productsapp:nodejs /app

USER productsapp

EXPOSE 3333

CMD ["dumb-init", "npm", "run", "start:dev"]

# --- Stage para build ---
FROM base AS build

RUN npm ci --include=dev

COPY . .

RUN npm run build

RUN npm ci --only=production && npm cache clean --force

# --- Stage final para produção ---
FROM base AS production

COPY --from=build --chown=productsapp:nodejs /app/dist ./dist
COPY --from=build --chown=productsapp:nodejs /app/node_modules ./node_modules
COPY --from=build --chown=productsapp:nodejs /app/package*.json ./

USER productsapp

EXPOSE 3333

CMD ["dumb-init", "node", "dist/app.js"]
```

### Docker Compose

```yaml
services:
  api:
    build:
      context: .
      dockerfile: Dockerfile 
      target: development 
    container_name: api-products
    ports:
      - '3333:3333' 
    environment:
      - PORT=${PORT}
      - CORS_ALLOWED_ORIGINS=${CORS_ALLOWED_ORIGINS}
      - DATABASE_USER=${DATABASE_USER}
      - DATABASE_PASSWORD=${DATABASE_PASSWORD}
      - DATABASE_DB=${DATABASE_DB}
      - DATABASE_URL=${DATABASE_URL}
      - VERSION=${VERSION}
    volumes:
      - .:/app
      - /app/node_modules
    depends_on:
      postgres:
        condition: service_healthy 
    networks:
      - api-products-network 
    restart: unless-stopped 

  postgres:
    container_name: api-products-pg 
    image: postgres:latest 
    ports:
      - 5432:5432
    environment:
      - POSTGRES_USER=${DATABASE_USER}
      - POSTGRES_PASSWORD=${DATABASE_PASSWORD}
      - POSTGRES_DB=${DATABASE_DB}
      - PGDATA=/data/postgres 
    volumes:
      - ./data/pg:/data/postgres
    networks: 
      - api-products-network 
    restart: unless-stopped 
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DATABASE_USER} -d ${DATABASE_DB}"]
      interval: 10s 
      timeout: 5s 
      retries: 5

networks:
  api-products-network:
    driver: bridge 
```

## 🚀 CI/CD com GitHub Actions

```yaml
# .github/workflows/run-e2e-tests.yml
name: Run E2E Tests
## Somente em pull request
on: [pull_request] 

jobs:
  run-e2e-tests:
    name: Run E2E Tests
    runs-on: ubuntu-latest

    services:
      postgres:
        image: bitnami/postgresql
        ports:
          - 5432:5432
        env:
          POSTGRESQL_USERNAME: docker
          POSTGRESQL_PASSWORD: docker
          POSTGRESQL_DATABASE: mydb

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: "npm"

      - run: npm ci

      - run: npm run test:e2e
        env:
          DATABASE_URL: "postgresql://docker:docker@localhost:5432/mydb?schema=public"
          DATABASE_USER: docker
          DATABASE_PASSWORD: docker
          DATABASE_DB: mydb
          
```
## 📝 Exemplos de Uso da API

### Listar Produtos

```bash
GET /api/v1/products

Response:
[
  {
    "id": "1559d28d-6940-4b0c-b5a4-68709d8bdf62",
    "name": "Nome do Produto",
    "prices": 99.99,
    "sku": "SKU-123-45",
    "first_missing_letter": "a",
    "created_at": "2025-07-19T12:00:00Z",
    "updated_at": "2025-07-19T13:00:00Z"
  }
]

```
### Criar Produto

```bash
POST /api/v1/products
Content-Type: application/json

{
  "name": "Novo Produto XYZ",
  "price": 149.99
  "sku": "PRO-XYZ-001"
}

Response:
{
  "id": 9e8bea83-a01b-4443-ba8e-18e549cbcae5,
  "name": "Novo Produto XYZ",
  "price": 149.99,
  "first_missing_letter": "a",
  "created_at": "2024-01-15T11:00:00Z",
  "updated_at": "2024-01-15T11:00:00Z"
}
```

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

**Richard Lirio**
- GitHub: [@RichardLirio](https://github.com/RichardLirio)
- LinkedIn: [Richard Lirio](https://www.linkedin.com/in/richard-silva-lirio-b97484250/)

## 📚 Recursos Adicionais

- [Documentação NestJS](https://docs.nestjs.com/)
- [TypeORM Documentation](https://typeorm.io/)
- [Vitest Documentation](https://vitest.dev/)
- [Swagger/OpenAPI](https://swagger.io/)

---

*Este projeto foi desenvolvido como um desafio técnico, demonstrando boas práticas de desenvolvimento com NestJS, implementação de algoritmos personalizados, e configuração completa de um ambiente de desenvolvimento profissional.*