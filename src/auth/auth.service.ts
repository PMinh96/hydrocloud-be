import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entity/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { VerifyOTP } from './entity/verify-otp.entity';
import { RegisterDto } from './dto/register.dto';
import { CreateGoogleUserDto } from './dto/CreateGoogleUser.dto';
import { reset_password } from 'src/users/entity/reset_password.entity';
import { Tenant } from 'src/tenant/entities/tenant.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(reset_password)
    private reset_password: Repository<reset_password>,
    private userService: UsersService,
    private jwtService: JwtService,
    
  ) { }

  // async hashPassword(password: string): Promise<string> {
  //   try {
  //     const salt = await bcrypt.genSalt(10);
  //     const hash_pass = await bcrypt.hash(password, salt);
  //     return hash_pass;
  //   } catch (e) {
  //     //
  //   }
  // }
  async signIn(phone_number: string, pass: string) {
    try {
      const user = await this.userService.getUsersByPhone(phone_number);
      if (!user) return false;

      const passwordValid = await bcrypt.compare(pass, user.password);
      if (!passwordValid) return false;
      const payload = { sub: user.id, phone: user.phone_number, tenant: user.tenant_id, role: user.role };
      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    } catch (e) {
      return false;
    }
  }


  // async registerUser(body: RegisterDto) {
  //   const email = body.email.toLocaleLowerCase();
  //   const password = body.password;
  //   const name = body.name;
  //   const phone_number = body.phone_number;

  //   const check = await this.userService.findEmail(email);
  //   if (check) {
  //     throw new ConflictException('This account name already exists');
  //   }

  //   const hashedPassword = await bcrypt.hash(password, 10);

  //   const newUser = await this.userService.createUser({
  //     email,
  //     password: hashedPassword,
  //     name,
  //     phone_number
  //   });

  //   return {
  //     message: 'User registered successfully',
  //     userId: newUser.id,
  //   };
  // }

  // async forgotPassword(email: string) {
  //   const emailT = email.toLowerCase();
  //   const user = await this.userService.findEmail(email);
  //   if (!user) {
  //     throw new NotFoundException('Email không tồn tại');
  //   }
  //   const otpCheck = await this.reset_password.findOneBy({email});
  //   if(otpCheck){
  //     await this.reset_password.delete({ email });
  //   }
  //   const otp = Math.floor(10000 + Math.random() * 90000).toString();
  //   const expirationTime = new Date();
  //   expirationTime.setMinutes(expirationTime.getMinutes() + 10);

  //   const resetRequest = this.reset_password.create({
  //     email: emailT,
  //     otp: otp,
  //     expiresAt: expirationTime,
  //   });
  //   await this.reset_password.save(resetRequest);
  //   const result = await this.mailerService.sendResetPasswordEmail(emailT, otp);
  //   return result;
  // }

  // async resetPassword(email: string, newPassword: string, otp: string) {
  //   const emailT = email.toLowerCase();
  //   const resetRequest = await this.reset_password.findOne({
  //     where: { email: emailT, otp },
  //   });

  //   if (!resetRequest) {
  //     throw new BadRequestException('OTP không hợp lệ hoặc không tồn tại');
  //   }

  //   const currentTimeUTC = new Date();
  //   const expiresAtUTC = new Date(resetRequest.expiresAt);

  //   if (currentTimeUTC > expiresAtUTC) {
  //     throw new BadRequestException('OTP đã hết hạn');
  //   }

  //   await this.userService.update(emailT, newPassword);
  //   await this.reset_password.delete({
  //     email: emailT,
  //     otp,
  //   });
  //   return { message: 'Mật khẩu đã được cập nhật thành công' };
  // }
}
