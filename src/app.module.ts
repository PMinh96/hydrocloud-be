import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TenantModule } from './tenant/tenant.module';
import { MySqlModule } from './database/mysql.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProductModule } from './product/product.module';
import { WarehouseModule } from './warehouse/warehouse.module';
import { CustomerModule } from './customer/customer.module';
import { ProjectsModule } from './projects/projects.module';
import { OrderModule } from './order/order.module';

@Module({
  imports: [TenantModule, MySqlModule, AuthModule, UsersModule, ProductModule, WarehouseModule, CustomerModule, ProjectsModule, OrderModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
