import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminGuard } from 'src/guards/admin/admin.guard';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('auth')
  adminAuthenticate(@Body('password') password: string) {
    return this.adminService.authenticate(password);
  }

  @UseGuards(AdminGuard)
  @Get('org/:unique_name')
  getOrg(@Param('unqiue_name') unique_name: string) {
    return this.adminService.ls_org(unique_name);
  }

  @UseGuards(AdminGuard)
  @Put('org/mkvip/:unique_name')
  mkVip(@Param('unique_name') unique_name: string) {
    return this.adminService.mkvip(unique_name);
  }
}
