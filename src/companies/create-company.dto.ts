import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { SubscriptionPlan } from './company.entity';
export class CreateCompanyDto {
  @IsString() @IsNotEmpty() name: string;
  @IsString() @IsNotEmpty() commercial_register: string;
  @IsString() @IsNotEmpty() phone: string;
  @IsEmail() @IsOptional() email?: string;
  @IsString() @IsOptional() address?: string;
  @IsEnum(SubscriptionPlan) @IsOptional() subscription_plan?: SubscriptionPlan;
}
