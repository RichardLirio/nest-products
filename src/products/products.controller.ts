import {
  Controller,
  Post,
  Body,
  HttpCode,
  UsePipes,
  Get,
  Query,
  Param,
  Patch,
  Delete,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from "@nestjs/swagger";
import { ProductsService } from "./products.service";
import {
  CreateProductDto,
  createProductSchema,
} from "./dto/create.products.dto";
import { ProductResponseDto } from "./dto/product-response.dto";
import { ZodValidationPipe } from "@/pipes/zod-validation-pipe";
import { CreateProductSwaggerDto } from "./dto/create.products.swagger.dto";
import {
  PageQueryParamSchema,
  pageQueryParamSchema,
} from "./dto/query.products.dto";
import z from "zod/v3";
import { UpdateProductSwaggerDto } from "./dto/update.products.swagger.dto";
import { UpdateProductDto } from "./dto/update.products.dto";

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema);

@ApiTags("products")
@Controller("products")
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // POST /products
  // products Criação de produto
  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createProductSchema))
  @ApiOperation({ summary: "Criar um novo produto" })
  @ApiBody({
    type: CreateProductSwaggerDto,
    examples: {
      notebook: {
        summary: "Notebook",
        value: {
          name: "Notebook Dell Inspiron 15",
          price: 2599.99,
          sku: "DELL-NB-001",
        },
      },
      smartphone: {
        summary: "Smartphone",
        value: {
          name: "iPhone 15 Pro Max",
          price: 8999.99,
          sku: "APPL-IP15-001",
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: "Produto criado com sucesso",
    type: ProductResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: "Dados inválidos (Zod validation failed)",
    schema: {
      example: {
        statusCode: 400,
        message: [
          "Nome deve ter no máximo 255 caracteres",
          "Preço deve ser maior que zero",
          "SKU deve conter apenas letras, números, hífens e underscores",
        ],
        error: "Bad Request",
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: "SKU já existe",
    schema: {
      example: { message: "SKU já existe", error: "Conflict", statusCode: 409 },
    },
  })
  async create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  // GET /products
  // Lista de produtos
  @Get()
  @HttpCode(200)
  @ApiOperation({
    summary:
      "Listar todos os produtos ordenados por nome (Paginado com 20 itens por página)",
  })
  @ApiResponse({
    status: 200,
    description: "Lista de produtos com validação Zod",
    type: [ProductResponseDto],
  })
  async findAll(
    @Query("page", queryValidationPipe) page: PageQueryParamSchema
  ) {
    return this.productsService.findAll(page);
  }

  // GET /products/:id
  // Listar produto por id
  @Get(":id")
  @ApiOperation({ summary: "Buscar produto por ID (com validação Zod)" })
  @ApiParam({ name: "id", description: "ID do produto (validado via Zod)" })
  @ApiResponse({
    status: 200,
    description: "Produto encontrado",
    type: ProductResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: "ID inválido (Zod validation)",
    schema: {
      example: {
        statusCode: 400,
        message: "ID deve ser um número inteiro positivo",
        error: "Bad Request",
      },
    },
  })
  @ApiResponse({ status: 404, description: "Produto não encontrado" })
  findOne(@Param("id", new ZodValidationPipe(z.string().uuid())) id: string) {
    return this.productsService.findOne(id);
  }

  // PATCH /products/:id
  // Update products
  @Patch(":id")
  @ApiOperation({ summary: "Atualizar produto (Zod partial validation)" })
  @ApiParam({ name: "id", description: "ID do produto" })
  @ApiBody({
    type: UpdateProductSwaggerDto,
    examples: {
      partial: {
        summary: "Atualização parcial",
        value: {
          name: "Notebook Dell Inspiron 15 Gaming",
        },
      },
      complete: {
        summary: "Atualização completa",
        value: {
          name: "Notebook Dell Inspiron 15 Gaming",
          price: 3299.99,
          sku: "DELL-NB-001-GAMING",
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: "Produto atualizado com validação Zod",
    type: ProductResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: "Dados inválidos (Zod validation)",
    schema: {
      example: {
        statusCode: 400,
        message: [
          "name: Nome deve ter no máximo 255 caracteres",
          "price: Preço deve ser maior que zero",
          "SKU deve conter apenas letras, números, hífens e underscores",
        ],
        error: "Bad Request",
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: "Produto não encontrado",
    schema: {
      example: {
        message: "Produto não encontrado",
        error: "Not Found",
        statusCode: 404,
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: "SKU já existe",
    schema: {
      example: { message: "SKU já existe", error: "Conflict", statusCode: 409 },
    },
  })
  update(
    @Param("id", new ZodValidationPipe(z.string().uuid())) id: string,
    @Body() updateProductDto: UpdateProductDto
  ) {
    return this.productsService.update(id, updateProductDto);
  }

  // DELETE /products/:id
  // excluir produto
  @Delete(":id")
  @HttpCode(204)
  @ApiOperation({ summary: "Remover produto" })
  @ApiParam({ name: "id", description: "ID do produto" })
  @ApiResponse({ status: 204, description: "Produto removido com sucesso" })
  @ApiResponse({ status: 404, description: "Produto não encontrado" })
  remove(@Param("id", new ZodValidationPipe(z.string().uuid())) id: string) {
    return this.productsService.remove(id);
  }
}
