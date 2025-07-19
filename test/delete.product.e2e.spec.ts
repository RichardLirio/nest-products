import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { AppModule } from "@/app.module";
import { Repository } from "typeorm";
import { getRepositoryToken } from "@nestjs/typeorm";
import {
  cleanupTableProductsDatabase,
  cleanupTestDatabase,
  setupTestDatabase,
} from "test/setup-e2e";
import { Product } from "@/products/entities/product.entity";
import request from "supertest";
import { randomUUID } from "crypto";

describe("Delete product (E2E)", () => {
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
    await cleanupTableProductsDatabase();
  });

  it("[DELETE] /products/:id - Deve ser possivel deletar um produto", async () => {
    const product = await productRepository.save({
      name: "Notebook Dell Inspiron 15",
      price: 2599.99,
      sku: "DELL-NB-001",
    });

    const response = await request(app.getHttpServer()).delete(
      `/products/${product.id}`
    );

    expect(response.statusCode).toBe(204);

    const productOnDatabase = await productRepository
      .createQueryBuilder("product")
      .where("product.name = :name", {
        name: "Notebook Dell Inspiron 15 Gaming",
      })
      .getOne();

    expect(productOnDatabase).toBeNull();
  });

  it("Não deve ser possivel deletar um produto com um ID invalido", async () => {
    const response = await request(app.getHttpServer())
      .patch(`/products/${randomUUID()}`) // uuid invalido
      .send({
        name: "Notebook Dell Vostro 4",
        price: 3999.99,
        sku: "DELL-VO-004",
      });

    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({
      message: "Produto não encontrado",
      error: "Not Found",
      statusCode: 404,
    });
  });
});
