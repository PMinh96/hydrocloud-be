import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { RegisterDto } from 'src/auth/dto/register.dto';
import * as bcrypt from 'bcrypt';
import { TenantService } from 'src/tenant/tenant.service';


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @Inject(forwardRef(() => TenantService))
    private readonly tenantService: TenantService,
  ) { }


  async getUsersByPhone(phone_number: string) {
    const user = await this.userRepository.findOneBy({ phone_number });
    return user;
  }

  async profile(req: User) {
    const user = await this.userRepository.findOneBy({ id: req.id });
    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại');
    }
    const { password, ...userWithoutPassword } = user;
    const tenant = await this.tenantService.findOne(user.tenant_id);
    return { userWithoutPassword, tenant };
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }
  // findEmail(email: string) {
  //   return this.userRepository.findOne({
  //     where: [
  //       { email, is_google: false },
  //       { email, is_google: null }
  //     ],
  //   });
  // }
  findOne(id: string): Promise<User | null> {
    return this.userRepository.findOneBy({ id });
  }

  async create(inputs: RegisterDto): Promise<User> {
    const _user = await this.userRepository.create(inputs);

    await this.userRepository.save(_user);
    return _user;
  }
  async createUser(data: { password: string; name: string, phone_number: string, role: string, tenant_id: string, picture: string }): Promise<User> {
    const user = this.userRepository.create({
      ...data,
    });
    return await this.userRepository.save(user);
  }

  async updateAvatar(image: string, user: User): Promise<User> {
    return this.userRepository.save({
      picture: image,
      id: user.id,
    });
  }
  async update(phone_number: string, newPassword: string, oldPass?: string) {
    const user = await this.userRepository.findOne({ where: { phone_number: phone_number } });
    if (!user) {
      throw new BadRequestException('Người dùng không tồn tại');
    }

    if (oldPass) {
      const isOldPasswordCorrect = await bcrypt.compare(oldPass, user.password);
      if (!isOldPasswordCorrect) {
        throw new UnauthorizedException('Mật khẩu cũ không chính xác');
      }
    }
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await this.userRepository.update(user.id, { password: hashedNewPassword });

    return { message: 'Mật khẩu đã được cập nhật thành công' };
  }
}
