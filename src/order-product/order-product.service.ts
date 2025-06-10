import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderProductDto } from './dto/create-order-product.dto';
import { UpdateOrderProductDto } from './dto/update-order-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderProduct } from './entities/order-product.entity';
import { Repository } from 'typeorm';
import { ProductService } from 'src/product/product.service';

@Injectable()
export class OrderProductService {
  constructor(
    @InjectRepository(OrderProduct)
    private readonly orderProductRepository: Repository<OrderProduct>,
    private readonly productService: ProductService,
  ) { }
  async create(createOrderProductDto: CreateOrderProductDto) {
    const { order_id, products } = createOrderProductDto;

    const orderProducts = products.map((item) =>
      this.orderProductRepository.create({
        order_id,
        product_id: item.product_id,
        quantity: item.quantity,
        product_price: item.product_price,
        discount_product: item.discount_product,
        total_product_price: item.total_product_price,
      }),
    );

    await this.orderProductRepository.save(orderProducts);

    await this.productService.decreaseProductQuantities(
      products.map((p) => ({
        product_id: p.product_id,
        quantity: p.quantity,
      })),
    );

    return {
      message: 'Order products created successfully',
      data: orderProducts,
    };
  }

  async findAll() {
    const data = await this.orderProductRepository.find();
    return { message: 'All order products', data };
  }

  async findOne(id: string) {
    const item = await this.orderProductRepository.findOne({ where: { id } });
    if (!item) throw new NotFoundException(`Order product #${id} not found`);
    return { message: `Order product #${id}`, data: item };
  }

  async update(id: string, updateDto: UpdateOrderProductDto) {
    const result = await this.orderProductRepository.update(id, updateDto);
    if (result.affected === 0) {
      throw new NotFoundException(`Order product #${id} not found`);
    }
    const updated = await this.orderProductRepository.findOne({ where: { id } });
    return { message: `Order product #${id} updated`, data: updated };
  }

  async remove(id: string) {
    const result = await this.orderProductRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Order product #${id} not found`);
    }
    return { message: `Order product #${id} deleted successfully` };
  }

  async removeAllByOrderId(orderId: string) {
    const orderProducts = await this.orderProductRepository.find({ where: { order_id: orderId } });
    await this.productService.increaseProductQuantities(
      orderProducts.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity,
      })),
    );

    await this.orderProductRepository.delete({ order_id: orderId });
  }


  async findByOrderId(order_id: string) {
    return this.orderProductRepository.find({
      where: { order_id },
    });
  }
}
