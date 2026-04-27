import { IsNotEmpty, IsNumber, IsOptional, IsUUID, Min } from 'class-validator';
export class GenerateQrDto {
  @IsUUID() @IsNotEmpty() vehicle_id: string;
  @IsNumber() @IsOptional() @Min(0) driver_latitude?: number;
  @IsNumber() @IsOptional() @Min(0) driver_longitude?: number;
  @IsNumber() @IsOptional() @Min(0) odometer_reading?: number;
}
