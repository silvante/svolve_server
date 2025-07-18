import { IsString } from 'class-validator';

export class UpdatePincodeDto {
  @IsString()
  old_pincode: string;

  @IsString()
  new_pinocde: string;

  @IsString()
  pincode_confirmation: string;
}
