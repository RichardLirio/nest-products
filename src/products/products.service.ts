import {
  Injectable,
  ConflictException,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Product } from "./entities/product.entity";
import { CreateProductDto } from "./dto/create.products.dto";
import { UpdateProductDto } from "./dto/update.products.dto";

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>
  ) {}

  // Encontra a primeira letra ausente no nome do produto
  // Primeiro normalizo para minusculo, crio um new set para separar cada letra, dou um loop for com base na tabela do charcode para
  // encotrar a primeira letra faltante. Tabela do charcode no readme
  private findFirstMissingLetter(name: string): string {
    const normalizedName = name.toLowerCase().replace(/[^a-z]/g, "");
    const presentLetters = new Set(normalizedName);

    for (let i = 0; i < 26; i++) {
      const letter = String.fromCharCode(97 + i); // 'a' = 97
      if (!presentLetters.has(letter)) {
        return letter;
      }
    }

    return "_"; // Todas as letras estão presentes
  }

  //Adiciona a primeira letra ausente ao produto
  //Todo retorno vai pessar por esse metodo para colocar a letra, porém não irei persistir no banco
  private enrichProduct(product: Product): Product {
    return {
      ...product,
      first_missing_letter: this.findFirstMissingLetter(product.name),
    };
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const productAlreadyExist = await this.productRepository.findOne({
      where: { sku: createProductDto.sku },
    });

    if (productAlreadyExist) {
      throw new ConflictException("SKU já existe");
    }

    const product = this.productRepository.create(createProductDto);
    const savedProduct = await this.productRepository.save(product);
    return this.enrichProduct(savedProduct);
  }

  async findAll(page: number): Promise<Product[]> {
    const perPage = 20; //itens por pagina

    const products = await this.productRepository.find({
      take: perPage,
      skip: (page - 1) * perPage,
    });

    return products.map((product) => this.enrichProduct(product));
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException("Produto não encontrado");
    }

    return this.enrichProduct(product);
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto
  ): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException("Produto não encontrado");
    }

    if (updateProductDto.sku) {
      const productAlreadyExist = await this.productRepository.findOne({
        where: { sku: updateProductDto.sku },
      });

      if (productAlreadyExist) {
        throw new ConflictException("SKU já existe");
      }
    }

    await this.productRepository.update(id, updateProductDto);
    const updatedProduct = await this.productRepository.findOne({
      where: { id },
    });
    return this.enrichProduct(updatedProduct);
  }

  async remove(id: string): Promise<void> {
    const product = await this.productRepository.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException("Produto não encontrado");
    }

    await this.productRepository.delete(id);
  }
}
