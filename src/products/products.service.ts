import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepo: Repository<Product>,
  ) {}

  findAll() {
    return this.productsRepo.find();
  }

  findOne(id: string) {
    return this.productsRepo.findOneBy({ id });
  }

  create(data: Partial<Product>) {
    const product = this.productsRepo.create(data);
    return this.productsRepo.save(product);
  }

  async update(id: string, data: Partial<Product>) {
    const product = await this.productsRepo.preload({
      id: id,
      ...data,
    });
    if (!product) throw new NotFoundException(`Product ${id} not found`);
    return this.productsRepo.save(product);
  }

  async remove(id: string) {
    const product = await this.findOne(id);
    if (!product) throw new NotFoundException(`Product ${id} not found`);
    return this.productsRepo.remove(product);
  }
}
