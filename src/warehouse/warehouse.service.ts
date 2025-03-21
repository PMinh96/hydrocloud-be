import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/product/entities/product.entity';
import { User } from 'src/users/entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class WarehouseService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) { }
  async findAll(req: User) {
    const products = await this.productRepository.find({ where: { tenant_id: req.tenant_id } })
    return products
  }

  async findOne(req: User, id: string) {
    const products = await this.productRepository.find({ where: { id, tenant_id: req.tenant_id } })
    return products
  }

  async update(req: User, id: string, restockQuantity: number): Promise<Product> {
    const product = await this.productRepository.findOneBy({ id, tenant_id: req.tenant_id });

    if (!product) {
      throw new NotFoundException('Sản phẩm không tồn tại');
    }

    if (restockQuantity <= 0) {
      throw new BadRequestException('Số lượng nhập phải lớn hơn 0');
    }

    product.inventory += restockQuantity;

    return await this.productRepository.save(product);
  }
}
