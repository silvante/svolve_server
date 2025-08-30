import { IsString } from 'class-validator';

export class SearchClientParamsDto {
  @IsString()
  name: string;

  @IsString()
  surname: string;

  @IsString()
  born_in: string;

  @IsString()
  type_id: string;
}
