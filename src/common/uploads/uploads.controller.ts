import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UseGuards,
  UploadedFile,
  Req,
} from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from './multer.options';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { RequestWithUser } from 'src/interfaces/request-with-user.interface';

@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @UseGuards(AuthGuard)
  @Post('/avatar')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  uploadAvatar(
    @Req() req: RequestWithUser,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.uploadsService.uploadAvatar(req, file);
  }

  @UseGuards(AuthGuard)
  @Post('/banner')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  uploadBanner(
    @Req() req: RequestWithUser,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.uploadsService.uploadBanner(req, file);
  }

  @UseGuards(AuthGuard)
  @Post('/logo')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  uploadLogo(
    @Req() req: RequestWithUser,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.uploadsService.uploadLogo(req, file);
  }
}
