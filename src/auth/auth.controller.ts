import { Body, Controller, Post, Get, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('login') login(@Body() dto: LoginDto) { return this.authService.login(dto); }
  @UseGuards(JwtAuthGuard) @Get('me') getMe(@Request() req) { return req.user; }
}
