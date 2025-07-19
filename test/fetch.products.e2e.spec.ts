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

describe("Fetch Products (E2E)", () => {
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

  it("[GET] /api/v1/product - Deve ser possivel buscar produtos", async () => {
    await createProduct("Notebook Dell Inspiron 15", 2599.99, "DELL-NB-001");

    const response = await request(app.getHttpServer())
      .get("/products")
      .query({ page: 1 });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          name: "Notebook Dell Inspiron 15",
          price: 2599.99,
          sku: "DELL-NB-001",
          first_missing_letter: "a",
          created_at: expect.any(String),
          updated_at: expect.any(String),
        }),
      ])
    );
  });

  it("Deve ser possivel realizar a paginação com 20 itens por pagina", async () => {
    for (let i = 1; i <= 21; i++) {
      await createProduct(
        `Notebook Dell Inspiron ${i}`,
        2599.99,
        `DELL-NB-00${i}`
      );
    }

    const response = await request(app.getHttpServer())
      .get("/products")
      .query({ page: 2 });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          name: "Notebook Dell Inspiron 21",
          price: 2599.99,
          sku: "DELL-NB-0021",
          first_missing_letter: "a",
          created_at: expect.any(String),
          updated_at: expect.any(String),
        }),
      ])
    );
  });
});
