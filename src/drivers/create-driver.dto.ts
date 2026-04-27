import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
export class CreateDriverDto {
  @IsUUID() @IsNotEmpty() user_id: string;
  @IsUUID() @IsNotEmpty() company_id: string;
  @IsUUID() @IsOptional() vehicle_id?: string;
}
