import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiResponse } from 'src/commons/api-response';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Post()
  @UseGuards(AuthGuard)
  async create(@Request() req, @Body() createProductDto: CreateProductDto) {
    const result = await this.productService.create(req.user, createProductDto);
    return ApiResponse.success("success", result);
  }

  @UseGuards(AuthGuard)
  @Get()
  async findAll(@Request() req) {
    const result = await this.productService.findAll(req.user);
    return ApiResponse.success("success", result);
  }

  @UseGuards(AuthGuard)
  @Patch()
  async update(@Request() req, @Query('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    const result = await this.productService.update(req, id, updateProductDto);
    return ApiResponse.success("success", result)
  }

  @UseGuards(AuthGuard)
  @Delete()
  async remove(@Request() req,
    @Query('id') id: string) {
    const result = await this.productService.remove(req.user, id);
    return ApiResponse.success("success", result)
  }
}
