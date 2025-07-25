import { IsInt, IsString } from 'class-validator';

export class CreateTypeDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsInt()
  price: number;
}
