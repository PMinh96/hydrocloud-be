import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entity/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersController } from './users.controller';
import { TenantModule } from 'src/tenant/tenant.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), ConfigModule, forwardRef(() => TenantModule)],
  providers: [UsersService],
  controllers:[UsersController],
  exports: [UsersService, TypeOrmModule]
})
export class UsersModule {}
