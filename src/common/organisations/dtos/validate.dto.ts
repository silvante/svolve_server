import { IsString } from 'class-validator';

export class ValidateOrganisationDto {
  @IsString()
  pincode: string;
}
