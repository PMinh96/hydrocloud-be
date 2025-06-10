import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { User } from 'src/users/entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderProductService } from 'src/order-product/order-product.service';
import { PaymentStatus } from './dto/enum/order.enum';
import { ProductService } from 'src/product/product.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    private readonly orderProductService: OrderProductService,
    private readonly productService: ProductService,
  ) { }

  async create(req: User, createOrderDto: CreateOrderDto) {
    const {
      products,
      ...orderData
    } = createOrderDto;

    const newOrder = this.orderRepository.create({
      ...orderData,
      tenant_id: req.tenant_id,
      payment_status: PaymentStatus.UNPAID,
    });

    const savedOrder = await this.orderRepository.save(newOrder);
    await this.orderProductService.create({
      order_id: savedOrder.id,
      products: products.map((p) => ({
        ...p,
        total_product_price: p.total_product_price,
      })),
    });
    return {
      message: 'Order created successfully',
      data: savedOrder,
    };
  }

  async findAll(
    user: User,
    page: number = 1,
    limit: number = 10,
    customerName?: string,
  ) {
    const skip = (page - 1) * limit;

    const query = this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('users', 'user', 'order.manager_id = user.id')
      .where('order.tenant_id = :tenantId', { tenantId: user.tenant_id })
      .orderBy('order.created_at', 'DESC');

    if (customerName) {
      query.andWhere('user.name LIKE :name', { name: `%${customerName}%` });
    }

    query.skip(skip).take(limit).orderBy('order.created_at', 'DESC');

    const [data, total] = await query.getManyAndCount();

    return {
      data,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    };
  }


  async findOne(user: User, id: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['orderProducts'],
    });
    if (order?.tenant_id !== user.tenant_id) {
      throw new UnauthorizedException('You do not have permission to access this order');
    }
    if (!order) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }
    return order;
  }

  async updateProductList(user: User, id: string, products: any[]) {
    const order = await this.findOne(user, id);

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.tenant_id !== user.tenant_id) {
      throw new UnauthorizedException('You do not have permission to update this order');
    }
    await this.orderProductService.removeAllByOrderId(id);
    await this.orderProductService.create({
      order_id: id,
      products: products.map((p) => ({
        ...p,
        total_product_price: p.total_product_price,
      })),
    });

    return {
      message: 'Order products updated successfully',
      data: order,
    };
  }

  async update(user: User, id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.findOne(user, id);
    if (order.tenant_id !== user.tenant_id) {
      throw new UnauthorizedException('You do not have permission to update this order');
    }
    Object.assign(order, updateOrderDto);
    return await this.orderRepository.save(order); 
  }
}
