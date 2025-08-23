import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { RequestWithUser } from 'src/interfaces/request-with-user.interface';
import { UpdateUserDTO } from './dtos/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard)
  @Put('update')
  updateUser(@Req() req: RequestWithUser, @Body() data: UpdateUserDTO) {
    return this.userService.updateUser(req, data);
  }

  @UseGuards(AuthGuard)
  @Get('/works')
  getMyWorks(@Req() req: RequestWithUser) {
    return this.userService.getMyWork(req);
  }

  @Get(':id')
  getUserById(@Param('id') id: string) {
    return this.userService.getUserById(+id);
  }
}
