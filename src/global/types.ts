import { IsString } from 'class-validator';

export class OrgBanner {
  @IsString()
  original: string;

  @IsString()
  thumbnail: string;
}
