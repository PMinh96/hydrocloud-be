import { Controller, Get, UseGuards, Request, Query, Param, Patch, Body, HttpStatus, Req, Post, Delete, UseInterceptors, UploadedFile, BadRequestException, Put } from "@nestjs/common";
import { UsersService } from "./users.service";
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiTags } from "@nestjs/swagger";
import { ApiResponse } from "src/commons/api-response";


@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) { }

  @Get('profile')
  @UseGuards(AuthGuard)
  async profile(@Request() req) {
    const result = await this.usersService.profile(req.user);
    return ApiResponse.success("success", result);
  } 
}