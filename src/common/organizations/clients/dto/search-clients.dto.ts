
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class SearchClientParamsDto {
  @IsString()
  name: string = '';

  @IsString()
  surname: string = '';

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  born_in?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  type_id?: number;

  @Type(() => Number)
  @IsNumber()
  page: number = 1;

  @Type(() => Number)
  @IsNumber()
  limit: number = 10;
}
