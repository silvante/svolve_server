import { IsArray, IsString } from 'class-validator';

export class CreateWorkerDto {
  @IsString()
  role: string;

  @IsArray()
  attached_types: [number];
}
