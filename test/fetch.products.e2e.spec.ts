import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { AppModule } from "@/app.module";
import request from "supertest";
import { Repository } from "typeorm";
import { getRepositoryToken } from "@nestjs/typeorm";
import {
  cleanupTableUserDatabase,
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
    await cleanupTableUserDatabase();
  });

  // Função para criar produto no banco de dados
  async function createProduct(name: string, price: number, sku: string) {
    return await productRepository.save({
      name,
      price,
      sku,
    });
  }

  //teste de sucesso com o token de um admin user
  it("[GET] /api/v1/product - should fetch all product", async () => {
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
});
