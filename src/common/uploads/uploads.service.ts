import { HttpException, Injectable } from '@nestjs/common';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { RequestWithUser } from 'src/interfaces/request-with-user.interface';
import { randomUUID } from 'crypto';
import * as sharp from 'sharp';

@Injectable()
export class UploadsService {
  private s3: S3Client;
  private bucket_name: string;

  constructor(private configService: ConfigService) {
    this.s3 = new S3Client({
      region: this.configService.get<string>('AWS_S3_REGION', ''),
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_S3_ACCESS_KEY', ''),
        secretAccessKey: this.configService.get<string>(
          'AWS_S3_SECRET_KEY',
          '',
        ),
      },
    });
    this.bucket_name = this.configService.get<string>('AWS_S3_BUCKET_NAME', '');
  }

  async uploadAvatar(req: RequestWithUser, file: Express.Multer.File) {
    const user = req.user;
    const folder = 'avatars';
    const key = `${folder}/${user.username}-${randomUUID()}-${file.originalname}`;

    let optimisedBuffer: Buffer;

    if (file.mimetype === 'image/svg+xml') {
      throw new HttpException('SVG files are not allowed for avatars', 404);
    } else {
      optimisedBuffer = await sharp(file.buffer)
        .resize({ width: 400, height: 400 })
        .toFormat('webp', { quality: 50 })
        .toBuffer();
    }

    const command = new PutObjectCommand({
      Bucket: this.bucket_name,
      Key: key.endsWith('.webp') ? key.replace(/\.[^.]+$/, '.webp') : key,
      Body: optimisedBuffer,
      ContentType:
        file.mimetype === 'image/svg+xml' ? 'image/svg+xml' : 'image/webp',
    });

    await this.s3.send(command);

    return `https://${this.bucket_name}.s3.amazonaws.com/${command.input.Key}`;
  }

  async uploadBanner(req: RequestWithUser, file: Express.Multer.File) {
    const user = req.user;
    const folder = 'banners';
    const original_key = `${folder}/${user.username}-${randomUUID()}-1280-${file.originalname}`;
    const thumbnail_key = `${folder}/${user.username}-${randomUUID()}-480-${file.originalname}`;

    let optimisedOriginalBuffer: Buffer;
    let optimisedThumbnailBuffer: Buffer;

    if (file.mimetype === 'image/svg+xml') {
      throw new HttpException('SVG files are not allowed for banners', 404);
    } else {
      optimisedOriginalBuffer = await sharp(file.buffer)
        .resize({ width: 1280, height: 320 })
        .toFormat('webp', { quality: 80 })
        .toBuffer();

      optimisedThumbnailBuffer = await sharp(file.buffer)
        .resize({ width: 480, height: 120 })
        .toFormat('webp', { quality: 50 })
        .toBuffer();
    }

    const command_orinal = new PutObjectCommand({
      Bucket: this.bucket_name,
      Key: original_key.endsWith('.webp')
        ? original_key.replace(/\.[^.]+$/, '.webp')
        : original_key,
      Body: optimisedOriginalBuffer,
      ContentType:
        file.mimetype === 'image/svg+xml' ? 'image/svg+xml' : 'image/webp',
    });

    const command_thumbnail = new PutObjectCommand({
      Bucket: this.bucket_name,
      Key: thumbnail_key.endsWith('.webp')
        ? thumbnail_key.replace(/\.[^.]+$/, '.webp')
        : thumbnail_key,
      Body: optimisedThumbnailBuffer,
      ContentType:
        file.mimetype === 'image/svg+xml' ? 'image/svg+xml' : 'image/webp',
    });

    await this.s3.send(command_orinal);
    await this.s3.send(command_thumbnail);

    return {
      original: `https://${this.bucket_name}.s3.amazonaws.com/${command_orinal.input.Key}`,
      thumbnail: `https://${this.bucket_name}.s3.amazonaws.com/${command_thumbnail.input.Key}`,
    };
  }

  async uploadLogo(req: RequestWithUser, file: Express.Multer.File) {
    const user = req.user;
    const folder = 'logos';
    const key = `${folder}/${user.username}-${randomUUID()}-${file.originalname}`;

    let optimisedBuffer: Buffer;

    if (file.mimetype === 'image/svg+xml') {
      optimisedBuffer = file.buffer;
    } else {
      optimisedBuffer = await sharp(file.buffer)
        .resize({ height: 200 })
        .toFormat('webp', { quality: 80 })
        .toBuffer();
    }

    const command = new PutObjectCommand({
      Bucket: this.bucket_name,
      Key: key.endsWith('.webp') ? key.replace(/\.[^.]+$/, '.webp') : key,
      Body: optimisedBuffer,
      ContentType:
        file.mimetype === 'image/svg+xml' ? 'image/svg+xml' : 'image/webp',
    });

    await this.s3.send(command);

    return `https://${this.bucket_name}.s3.amazonaws.com/${command.input.Key}`;
  }
}
