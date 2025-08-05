import { IsNumber, IsString } from 'class-validator';

export class CreateVacancyDto {
  @IsString()
  name: string;

  @IsNumber()
  age: number;

  @IsString()
  about: string;

  @IsString()
  contact: string;

  @IsString()
  origin: string;
}
