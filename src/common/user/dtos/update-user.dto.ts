import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDTO {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsString()
  bio: string;

  @IsString()
  contact: string;
}
