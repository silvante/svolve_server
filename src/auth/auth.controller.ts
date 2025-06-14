import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  registerUser(@Body() data: RegisterDto) {
    return this.authService.RegisterUser(data);
  }

  @Post('signin')
  signin(@Body() data: LoginDto) {
    return this.authService.LoginUser(data);
  }

  @Get('verify-magic-link')
  verifyMagicLink(@Query('token') token: string) {
    return this.authService.verifyMagicLink(token);
  }
}
