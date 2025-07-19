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

describe("Update product (E2E)", () => {
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

  it("[PATCH] /products - Deve ser possivel atualizar um produto", async () => {
    const product = await productRepository.save({
      name: "Notebook Dell Inspiron 15",
      price: 2599.99,
      sku: "DELL-NB-001",
    });

    const response = await request(app.getHttpServer())
      .patch(`/products/${product.id}`)
      .send({
        name: "Notebook Dell Inspiron 15 Gaming",
      });

    expect(response.statusCode).toBe(200); //status code esperado no retorno da rota de criação de produto

    const productOnDatabase = await productRepository
      .createQueryBuilder("product")
      .where("product.name = :name", {
        name: "Notebook Dell Inspiron 15 Gaming",
      })
      .getOne(); // Teste com o query build e não com o retorno para verificar a persistencia no banco correta

    expect(productOnDatabase).toBeTruthy(); //verifica dentro do banco de dados se o produto foi criado
  });

  it("Não deve ser possivel atualizar um produto com SKU já existente", async () => {
    await productRepository.save({
      name: "Notebook Dell Inspiron 15",
      price: 2599.99,
      sku: "DELL-NB-001",
    });

    const product = await productRepository.save({
      name: "Notebook Dell Vostro 4",
      price: 3999.99,
      sku: "DELL-VO-004",
    });

    const response = await request(app.getHttpServer())
      .patch(`/products/${product.id}`)
      .send({
        sku: "DELL-NB-001", //passado sku do primeiro produto
      });

    expect(response.statusCode).toBe(409);
    expect(response.body).toEqual({
      statusCode: 409,
      message: "SKU já existe",
      error: "Conflict",
    });
  });

  it("Não deve ser possivel atualizar um produto com um ID invalido", async () => {
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
