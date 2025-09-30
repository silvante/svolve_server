import { IsOptional, IsString } from 'class-validator';
import { OrgBanner } from 'src/global/types';

export class UpdateOrganizationDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsOptional()
  banner?: OrgBanner;

  @IsOptional()
  @IsString()
  logo?: string;
}
