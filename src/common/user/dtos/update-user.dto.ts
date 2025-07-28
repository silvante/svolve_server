import { IsString } from 'class-validator';

export class UpdateUserDTO {
  @IsString()
  name: string;

  @IsString()
  avatar: string;

  @IsString()
  bio: string;

  @IsString()
  contact: string;
}
