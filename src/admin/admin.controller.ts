import { Body, Controller, Post } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('auth')
  adminAuthenticate(@Body('password') password: string) {
    return this.adminService.authenticate(password);
  }
}
