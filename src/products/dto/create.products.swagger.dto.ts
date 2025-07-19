import { ApiProperty } from "@nestjs/swagger";

export class CreateProductSwaggerDto {
  @ApiProperty({
    description: "Nome do produto",
    example: "Notebook",
    required: true,
    minLength: 1,
    maxLength: 255,
    type: String,
  })
  name: string;

  @ApiProperty({
    description: "Preço do produto",
    example: 2599.99,
    required: true,
    maximum: 999999.99,
    type: Number,
  })
  price: number;

  @ApiProperty({
    description: "SKU único do produto",
    example: "APPL-IP15-001",
    type: String,
    required: true,
    maxLength: 100,
  })
  sku: string;
}

export class CreateProductResponseSwaggerDto {
  @ApiProperty({
    description: "Código de status do sucesso",
    example: "Product created successfully",
  })
  message: string;
}

export class ErrorResponseSwaggerDto {
  @ApiProperty({
    description: "Código de status do erro",
    example: 409,
  })
  statusCode: number;

  @ApiProperty({
    description: "Mensagem de erro",
    example: "Product with same e-mail address already exists.",
  })
  message: string;

  @ApiProperty({
    description: "Tipo de erro",
    example: "ConflictException",
  })
  error: string;
}

export class ErrorZodResponseSwaggerDto {
  @ApiProperty({
    description: "Código de status do erro",
    example: 400,
  })
  statusCode: number;

  @ApiProperty({
    description: "Mensagem de erro",
    example: "Validation failed",
  })
  message: string;

  @ApiProperty({
    description: "Tipo de erro",
    example: "ZodValidationError",
  })
  error: string;
}
