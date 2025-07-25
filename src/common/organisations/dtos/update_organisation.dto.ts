import { IsOptional, IsString } from 'class-validator';

export class UpdateOrganisationDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsOptional()
  banner: OrgBanner;

  @IsOptional()
  @IsString()
  logo: string;
}

export class OrgBanner {
  @IsString()
  original: string;

  @IsString()
  thumbnail: string;
}
