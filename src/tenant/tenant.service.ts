import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Tenant } from './entities/tenant.entity';
import { Repository } from 'typeorm/repository/Repository';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class TenantService {
  constructor(
    @InjectRepository(Tenant)
    private tenantRepository: Repository<Tenant>,
    private userSerivce: UsersService,
  ) { }

  async create(createTenantDto: CreateTenantDto) {
    const {
      name,
      address,
      picture,
      phone_number,
      rented_from,
      rented_until,
      admin_password,
    } = createTenantDto;

    const tenantData: Partial<Tenant> = {
      name,
      address,
      phone_number,
      rented_from,
      rented_until,
      picture,
    };

    const tenant = await this.tenantRepository.create(tenantData);
    await this.tenantRepository.save(tenant);

    const hashedPassword = await bcrypt.hash(admin_password, 10);
    const data = {
      name: name,
      address: address,
      phone_number: phone_number,
      password: hashedPassword,
      role: 'admin',
      tenant_id: tenant.id,
      picture,
    }
    const adminUser = await this.userSerivce.createUser(data);

    return { tenant, adminUser };
  }

  findAll() {
    return `This action returns all tenant`;
  }

  async findOne(id: string) {
    const tenant = await this.tenantRepository.findOneBy({ id });
    if (!tenant) {
       throw new ForbiddenException('Tenant not found');
    }
    return tenant;
  }

  update(id: number, updateTenantDto: UpdateTenantDto) {
    return `This action updates a #${id} tenant`;
  }

  remove(id: number) {
    return `This action removes a #${id} tenant`;
  }
}
