import { Injectable } from '@nestjs/common';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { RequestWithUser } from 'src/interfaces/request-with-user.interface';
import { randomUUID } from 'crypto';
import sharp from 'sharp';

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
      optimisedBuffer = file.buffer;
    } else {
      optimisedBuffer = await sharp(file.buffer)
        .resize({ width: 400, height: 400 })
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
