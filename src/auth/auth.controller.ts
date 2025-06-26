import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { RequestWithUser } from 'src/interfaces/request-with-user.interface';
import { Response } from 'express';
import * as PassportStrategy from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  registerUser(@Body() data: RegisterDto) {
    return this.authService.registerUser(data);
  }

  @Post('signin')
  signin(@Body() data: LoginDto) {
    return this.authService.loginUser(data);
  }

  @Get('verify-magic-link')
  verifyMagicLink(@Query('token') token: string) {
    return this.authService.verifyMagicLink(token);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Req() req: RequestWithUser) {
    return this.authService.getUserProfile(req);
  }

  @Get('github')
  @UseGuards(PassportStrategy.AuthGuard('github'))
  githubDirector() {
    // redirects to github login page
  }

  @Get('github/callback')
  @UseGuards(PassportStrategy.AuthGuard('github'))
  githubValidator(@Req() req: RequestWithUser, @Res() res: Response) {
    return this.authService.githubHandler(req, res);
  }

  @Get('google')
  @UseGuards(PassportStrategy.AuthGuard('google'))
  googleDirector() {
    // redirects to google login page
  }

  @Get('google/callback')
  @UseGuards(PassportStrategy.AuthGuard('google'))
  googleValidator(@Req() req: RequestWithUser, @Res() res: Response) {
    return this.authService.googleHandler(req, res);
  }

  @Get('/reset')
  resetToken(@Query('token') token: string) {
    return this.authService.ResetToken(token);
  }
}
