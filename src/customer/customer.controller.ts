import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) { }

  @UseGuards(AuthGuard)
  @Post()
  create(
    @Request() req,
    @Body() createCustomerDto: CreateCustomerDto) {
    return this.customerService.create(req.user, createCustomerDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  async findAll(@Request() req) {
    return this.customerService.findAll(req.user);
  }

  @UseGuards(AuthGuard)
  @Get()
  findOne(
    @Request() req,
    @Query('id') id: string) {
    return this.customerService.findOne(req.user, id);
  }

  @UseGuards(AuthGuard)
  @Patch()
  update(
    @Request() req,
    @Query('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto) {
    return this.customerService.update(req.user, id, updateCustomerDto);
  }

  @UseGuards(AuthGuard)
  @Delete('')
  remove(
    @Request() req,
    @Query('id') id: string) {
    return this.customerService.remove(req.user, id);
  }
}
