import { IsString } from 'class-validator';

export class RegisterDto {
  @IsString()
  email: string;

  @IsString()
  name: string;

  @IsString()
  password: string;
}
