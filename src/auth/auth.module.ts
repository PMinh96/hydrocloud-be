import { forwardRef, Module } from '@nestjs/common';

import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { jwtConstants } from './constants';
import { JwtModule } from '@nestjs/jwt';

import { VerifyOTP } from './entity/verify-otp.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { UsersService } from '../users/users.service';
import { reset_password } from 'src/users/entity/reset_password.entity';
import { TenantModule } from 'src/tenant/tenant.module';

@Module({
  imports: [
    UsersModule,
    forwardRef(() => TenantModule),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'defaultSecret',
      signOptions: { expiresIn: '7d' },
    }),
    TypeOrmModule.forFeature([VerifyOTP, reset_password]),
  ],
  controllers: [AuthController],
  providers: [AuthService, UsersService],
})
export class AuthModule {}
