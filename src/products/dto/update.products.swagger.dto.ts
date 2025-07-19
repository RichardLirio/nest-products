import { ApiProperty } from "@nestjs/swagger";

export class UpdateProductSwaggerDto {
  @ApiProperty({
    description: "Nome do produto",
    example: "Notebook",
    required: false,
    minLength: 1,
    maxLength: 255,
    type: String,
  })
  name: string;

  @ApiProperty({
    description: "Preço do produto",
    example: 2599.99,
    required: false,
    maximum: 999999.99,
    type: Number,
  })
  price: number;

  @ApiProperty({
    description: "SKU único do produto",
    example: "APPL-IP15-001",
    type: String,
    required: false,
    maxLength: 100,
  })
  sku: string;
}
