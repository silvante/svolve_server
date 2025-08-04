import { IsNumber, IsString } from 'class-validator';

export class CreateVacancyDto {
  @IsNumber()
  age: number;

  @IsString()
  about: string;

  @IsString()
  contact: string;
}
