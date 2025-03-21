import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { WarehouseService } from './warehouse.service';
import { ApiResponse } from 'src/commons/api-response';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('warehouse')
export class WarehouseController {
  constructor(private readonly warehouseService: WarehouseService) { }

  @UseGuards(AuthGuard)
  @Get()
  async findAll(@Request() req) {
    const result = await this.warehouseService.findAll(req.user);
    return ApiResponse.success("success", result);
  }

  @Get()
  async findOne(@Request() req, @Query('id') id: string) {
    const result = await this.warehouseService.findOne(req.user, id);
    return ApiResponse.success("success", result)
  }

  @UseGuards(AuthGuard)
  @Patch('restockQuantity')
  async update(
    @Request() req,
    @Query('id') id: string,
    @Query('restockQuantity ') restockQuantity: number
  ) {
    const result = await this.warehouseService.update(req.user, id, restockQuantity);
    return ApiResponse.success("success", result)
  }
}
