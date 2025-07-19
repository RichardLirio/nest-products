import { ApiProperty } from "@nestjs/swagger";
import { IsPositive, IsString, Length, IsDate, IsUUID } from "class-validator";
import { randomUUID } from "crypto";

export class ProductResponseDto {
  @ApiProperty({ example: randomUUID(), description: "ID do Produto (UUID)" })
  @IsUUID()
  @IsPositive()
  id: number;

  @ApiProperty({
    example: "Nome do Produto",
    description: "Name of the product",
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 99.99,
    description: "Preço do Produto (numero sempre positivo)",
  })
  @IsPositive()
  price: number;

  @ApiProperty({
    example: "SKU-123-45",
    description: "Codigo unico para controle de estoque",
  })
  @IsString()
  sku: string;

  @ApiProperty({
    example: "A",
    description: "Primeira letra faltante em sequencia (único caracter)",
  })
  @IsString()
  @Length(1, 1)
  first_missing_letter: string;

  @ApiProperty({
    example: "2025-07-19T12:00:00Z",
    description: "Creation timestamp",
  })
  @IsDate()
  created_at: Date;

  @ApiProperty({
    example: "2025-07-19T13:00:00Z",
    description: "Update timestamp",
  })
  @IsDate()
  updated_at: Date;
}
