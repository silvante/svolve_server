import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dtos/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("signup")
  registerUser(@Body() data: RegisterDto) {
    return this.authService.RegisterUser(data);
  }
}
