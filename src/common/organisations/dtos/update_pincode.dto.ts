import { IsString } from 'class-validator';

export class UpdatePincodeDto {
  @IsString()
  old_pincode: string;

  @IsString()
  new_pincode: string;

  @IsString()
  pincode_confirmation: string;
}
