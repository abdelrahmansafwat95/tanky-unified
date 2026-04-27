import { IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { UserRole } from './user.entity';

export class CreateUserDto {
  @IsString() @IsNotEmpty() full_name: string;
  @IsString() @IsNotEmpty() phone: string;
  @IsString() @MinLength(6) password: string;
  @IsEnum(UserRole) role: UserRole;
}
