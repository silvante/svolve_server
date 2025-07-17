import { IsString } from 'class-validator';

export class UpdateOrganisationDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  banner: string;

  @IsString()
  logo: string;
}
