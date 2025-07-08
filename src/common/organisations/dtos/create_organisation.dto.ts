import { IsInt, IsString } from 'class-validator';

export class CreateOrganisationDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  banner: string;

  @IsString()
  logo: string;

  @IsString()
  pincode: string;
}
