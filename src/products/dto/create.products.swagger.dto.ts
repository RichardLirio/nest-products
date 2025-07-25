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
