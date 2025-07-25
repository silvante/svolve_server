import { IsOptional, IsString } from 'class-validator';

export class CreateOrganisationDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsOptional()
  banner: OrgBanner;

  @IsOptional()
  @IsString()
  logo: string;

  @IsString()
  pincode: string;
}

export class OrgBanner {
  @IsString()
  original: string;

  @IsString()
  thumbnail: string;
}
