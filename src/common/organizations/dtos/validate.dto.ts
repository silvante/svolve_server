import { IsString } from 'class-validator';

export class ValidateOrganizationDto {
  @IsString()
  pincode: string;
}
