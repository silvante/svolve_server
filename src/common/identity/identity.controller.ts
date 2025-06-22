import { Body, Controller, Post } from '@nestjs/common';
import { IdentityService } from './identity.service';
import { ForgotPasswordDto } from './dtos/forgotPassword.dto';

@Controller('identity')
export class IdentityController {
  constructor(private indetityService: IdentityService) {}

  @Post('forgot-password')
  forgotPassword(@Body() data: ForgotPasswordDto) {
    return this.indetityService.forgotPassword(data);
  }
}
