import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

@Entity("products")
export class Product {
  @ApiProperty({ description: "ID único do produto" })
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ApiProperty({ description: "Nome do produto" })
  @Column({ type: "text" })
  name: string;

  @ApiProperty({ description: "Preço do produto" })
  @Column({ type: "real" })
  price: number;

  @ApiProperty({ description: "SKU único do produto" })
  @Column({ type: "text", unique: true })
  sku: string;

  @ApiProperty({ description: "Primeira letra ausente no nome" })
  first_missing_letter?: string;

  @ApiProperty({ description: "Data de criação" })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({ description: "Data da última atualização" })
  @UpdateDateColumn()
  updated_at: Date;
}
