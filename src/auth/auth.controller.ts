import {
    Body,
    Controller,
    Post,
    HttpCode,
    HttpStatus,
    Query,
    Patch,
    BadRequestException,

} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { SendResponse } from 'src/response.utils';
import { ApiResponse } from 'src/commons/api-response';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private userService: UsersService,
    ) { }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    async signIn(@Body() signInDto: Record<string, any>) {
        const token = await this.authService.signIn(
            signInDto.phone_number,
            signInDto.password,
        );
        if (!token) {
            return SendResponse({
                message: 'Sai thông tin email hoặc mật khẩu',
                code: HttpStatus.BAD_REQUEST,
            });
        }
        const user = await this.userService.getUsersByPhone(signInDto.email);
        return SendResponse({
            message: 'Đăng nhập thành công.',
            data: {
                access_token: token.access_token,
                user: user
                    ? {
                        name: user.name,
                        phone_number: user.phone_number,
                        picture: user.picture,
                        role: user.role,
                        tenant_id: user.tenant_id,
                    }
                    : null,
            },
        });
    }

    // @Post('register')
    // async register(@Body() body: RegisterDto) {
    //     const register = await this.authService.registerUser(body)
    //     return register
    // }

    // @Post('resetPass')
    // async resetPass(
    //     @Query('email') email: string,
    //     @Query('new_password') new_password: string,
    //     @Query('otp') otp: string
    // ) {
    //     const register = await this.authService.resetPassword(email, new_password, otp)
    //     return ApiResponse.success("success", register)
    // }

    // @Post('forgotPass')
    // async forgotPass(
    //     @Query('email') email: string,
    // ) {
    //     const register = await this.authService.forgotPassword(email)
    //     return ApiResponse.success("success", register)
    // }

    @Patch('change_password')
    async change_password(
        @Query('email') email: string,
        @Query('newPassword') newPassword: string,
        @Query('old_password') old_password: string
    ) {
        if (!email || !newPassword || !old_password) {
            throw new BadRequestException('cần đầy đủ thông tin')
        }
        const change_password = await this.userService.update(email, newPassword, old_password)
        return ApiResponse.success("success", change_password)
    }
}