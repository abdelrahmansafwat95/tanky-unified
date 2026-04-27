import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { FuelType } from './vehicle.entity';
export class CreateVehicleDto {
  @IsString() @IsNotEmpty() plate_number: string;
  @IsString() @IsNotEmpty() model: string;
  @IsNumber() @IsOptional() year?: number;
  @IsEnum(FuelType) @IsOptional() fuel_type?: FuelType;
  @IsNumber() @Min(0) @IsOptional() daily_limit?: number;
  @IsNumber() @Min(0) @IsOptional() monthly_limit?: number;
  @IsUUID() @IsNotEmpty() company_id: string;
}
