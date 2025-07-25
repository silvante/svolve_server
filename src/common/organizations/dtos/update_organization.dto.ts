import { IsOptional, IsString } from 'class-validator';

export class OrgBanner {
  @IsString()
  original: string;

  @IsString()
  thumbnail: string;
}

export class UpdateOrganizationDto {
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
