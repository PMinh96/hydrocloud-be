import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { User } from 'src/users/entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { read } from 'fs';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) { }
  async create(req: User, createProductDto: CreateProductDto): Promise<Product> {
    const { name, price_in, discount_1 = 0, discount_2 = 0, unit, inventory } = createProductDto;

    if (!name || typeof name !== 'string') {
      throw new Error('Tên sản phẩm không hợp lệ.');
    }

    const trimmedName = name.trim();
    const existingProduct = await this.findOneByName(req, trimmedName)
    if (existingProduct) {
      throw new ConflictException(`Sản phẩm với tên "${existingProduct.name}" đã tồn tại.`);
    }

    let price_sale = price_in;
    if (discount_1 > 0) {
      price_sale -= (price_in * discount_1) / 100;
    }
    if (discount_2 > 0) {
      price_sale -= (price_sale * discount_2) / 100;
    }

    const product = this.productRepository.create({
      name: trimmedName,
      price_in,
      price_sale,
      inventory,
      unit,
      discount_1,
      discount_2,
      tenant_id: req.tenant_id
    });
    return await this.productRepository.save(product);
  }

  async findOneByName(req: User, name: string) {
    const existingProduct = await this.productRepository.findOne({
      where: { name, tenant_id: req.tenant_id }
    });
    return existingProduct
  }

  async findAll(req: User) {
    const products = await this.productRepository.find({ where: { tenant_id: req.tenant_id }, select:["id", "name", "price_sale", "unit", "inventory", "tenant_id"] })
    return products
  }

  async update(req: User, id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.productRepository.findOneBy({ id, tenant_id: req.tenant_id });

    if (!product) {
      throw new NotFoundException('Sản phẩm không tồn tại');
    }

    if (updateProductDto.inventory !== undefined) {
      throw new ConflictException('Vào kho để cập nhật');
    }

    if (updateProductDto.name) {
      const trimmedName = updateProductDto.name.trim();

      if (trimmedName !== product.name) {
        const existingProduct = await this.findOneByName(req, trimmedName);
        if (existingProduct) {
          throw new ConflictException('Tên sản phẩm đã tồn tại');
        }
      }

      product.name = trimmedName;
    }

    Object.assign(product, updateProductDto);

    if (updateProductDto.price_in !== undefined || updateProductDto.discount_1 !== undefined || updateProductDto.discount_2 !== undefined) {
      const newPriceIn = updateProductDto.price_in ?? product.price_in;
      const discount1 = updateProductDto.discount_1 ?? product.discount_1;
      const discount2 = updateProductDto.discount_2 ?? product.discount_2;

      let price_sale = newPriceIn;
      if (discount1 > 0) {
        price_sale -= (price_sale * discount1) / 100;
      }
      if (discount2 > 0) {
        price_sale -= (price_sale * discount2) / 100;
      }

      product.price_sale = price_sale;
    }

    return await this.productRepository.save(product);
  }


  async remove(req: User, id: string) {
    const product = await this.productRepository.findOneBy({ id, tenant_id: req.tenant_id })
    if (!product) {
      throw new NotFoundException('Sản phẩm không tồn tại hoặc bạn không có quyền xoá');
    }
    await this.productRepository.softDelete(product);
    return product.id;
  }
}
