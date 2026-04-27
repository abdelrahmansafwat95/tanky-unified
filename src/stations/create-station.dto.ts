import { IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
export class CreateStationDto {
  @IsString() @IsNotEmpty() name: string;
  @IsString() @IsNotEmpty() address: string;
  @IsNumber() @IsOptional() @Min(-90) @Max(90) latitude?: number;
  @IsNumber() @IsOptional() @Min(-180) @Max(180) longitude?: number;
  @IsString() @IsNotEmpty() phone: string;
  @IsNumber() @IsOptional() allowed_radius_meters?: number;
}
