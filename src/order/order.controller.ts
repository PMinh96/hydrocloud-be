import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @UseGuards(AuthGuard)
  async create(@Request() req, @Body() createOrderDto: CreateOrderDto) {
    return await this.orderService.create(req.user, createOrderDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll(@Request() req) {
    return this.orderService.findAll(req.user);
  }

  @UseGuards(AuthGuard)
  @Get()
  async findOne(
    @Request() req, @Query('id') id: string) {
    return this.orderService.findOne(req.user, id);
  }

  // @Patch()
  // update(@Query('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
  //   return this.orderService.update(+id, updateOrderDto);
  // }
}
