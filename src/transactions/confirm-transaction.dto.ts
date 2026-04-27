import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';
export class ConfirmTransactionDto {
  @IsString() @IsNotEmpty() qr_token: string;
  @IsUUID() @IsNotEmpty() station_id: string;
  @IsNumber() @Min(0.1) amount_liters: number;
  @IsNumber() @Min(0.1) price_per_liter: number;
  @IsNumber() @IsOptional() station_latitude?: number;
  @IsNumber() @IsOptional() station_longitude?: number;
}
