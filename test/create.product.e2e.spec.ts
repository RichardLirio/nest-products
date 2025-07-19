import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { AppModule } from "@/app.module";
import { Repository } from "typeorm";
import { getRepositoryToken } from "@nestjs/typeorm";
import {
  cleanupTableUserDatabase,
  cleanupTestDatabase,
  setupTestDatabase,
} from "test/setup-e2e";
import { Product } from "@/products/entities/product.entity";
import request from "supertest";

describe("Create product (E2E)", () => {
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
  }); //cria o setup antes dos testes

  afterAll(async () => {
    await app.close();
    await cleanupTestDatabase();
  }); //derruba schemas apos os testes

  beforeEach(async () => {
    await cleanupTableUserDatabase();
  });

  test("[POST] /products", async () => {
    const response = await request(app.getHttpServer()).post("/products").send({
      name: "Notebook Dell Inspiron 15",
      price: 2599.99,
      sku: "DELL-NB-001",
    });

    expect(response.statusCode).toBe(201); //status code esperado no retorno da rota de criação de produto

    const productOnDatabase = await productRepository
      .createQueryBuilder("product")
      .where("product.sku = :sku", { sku: "DELL-NB-001" })
      .getOne();

    expect(productOnDatabase).toBeTruthy(); //verifica dentro do banco de dados se o produto foi criado
  });

  it("Não deve ser possivel cadastrar dois produtos com o mesmo SKU", async () => {
    await productRepository.save({
      name: "Notebook Dell Inspiron 15",
      price: 2599.99,
      sku: "DELL-NB-001",
    });

    const response = await request(app.getHttpServer()).post("/products").send({
      name: "Notebook Dell Inspiron 15",
      price: 2599.99,
      sku: "DELL-NB-001",
    });

    expect(response.statusCode).toBe(409);
    expect(response.body).toEqual({
      statusCode: 409,
      message: "SKU já existe",
      error: "Conflict",
    });
  });
});
