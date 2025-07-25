import { IsInt, IsString } from 'class-validator';

export class CreateClientDto {
  @IsString()
  name: string;

  @IsString()
  surname: string;

  @IsInt()
  born_in: number;

  @IsString()
  origin: string;

  @IsInt()
  price: number;

  @IsInt()
  type_id: number;
}
