import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { User } from 'src/users/entity/user.entity';
import { Customer } from './entities/customer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
  ) { }

  async create(req: User, createCustomerDto: CreateCustomerDto): Promise<Customer> {
    const { name, phone_number, address } = createCustomerDto;

    const existingCustomer = await this.customerRepository.findOneBy({
      phone_number,
      tenant_id: req.tenant_id
    });

    if (existingCustomer) {
      throw new ConflictException('Số điện thoại đã tồn tại trong hệ thống');
    }

    const newCustomer = this.customerRepository.create({
      name,
      phone_number,
      address,
      tenant_id: req.tenant_id
    });

    return await this.customerRepository.save(newCustomer);
  }

  async findAll(req: User) {
    const user = await this.customerRepository.find({ where: { tenant_id: req.tenant_id } })
    if (user.length <= 0) return []
    return user
  }

  async findOne(req: User, id: string): Promise<Customer> {
    const customer = await this.customerRepository.findOne({
      where: { id, tenant_id: req.tenant_id },
    });

    if (!customer) {
      throw new NotFoundException('Khách hàng không tồn tại');
    }

    return customer;
  }

  async update(req: User, id_customer: string, updateCustomerDto: UpdateCustomerDto): Promise<Customer> {
    const customer = await this.findOne(req, id_customer);

    if (req.role !== 'admin') {
      throw new ForbiddenException('Bạn không có quyền thực hiện thao tác này');
    }

    if (updateCustomerDto.phone_number) {
      const existingCustomer = await this.customerRepository.findOne({
        where: { phone_number: updateCustomerDto.phone_number, tenant_id: req.tenant_id },
      });

      if (existingCustomer && existingCustomer.id !== id_customer) {
        throw new ConflictException('Số điện thoại đã tồn tại trong hệ thống');
      }
    }

    Object.assign(customer, updateCustomerDto);

    return await this.customerRepository.save(customer);
  }

  async remove(req: User, id: string) {
    if (req.role !== 'admin') {
      throw new ForbiddenException('Bạn không có quyền thực hiện thao tác này');
    }
    const customer = await this.findOne(req, id);
    await this.customerRepository.softDelete(customer.id);
    return customer
  }
}
