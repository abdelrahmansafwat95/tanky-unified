import { Body, Controller, Get, Param, Post, Patch, UseGuards } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './create-company.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/user.entity';

@Controller('companies')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CompaniesController {
  constructor(private readonly s: CompaniesService) {}
  @Post() @Roles(UserRole.PLATFORM_ADMIN) create(@Body() dto: CreateCompanyDto) { return this.s.create(dto); }
  @Get()  @Roles(UserRole.PLATFORM_ADMIN) findAll() { return this.s.findAll(); }
  @Get(':id') @Roles(UserRole.PLATFORM_ADMIN, UserRole.COMPANY_ADMIN) findOne(@Param('id') id: string) { return this.s.findOne(id); }
  @Patch(':id/top-up') @Roles(UserRole.PLATFORM_ADMIN) topUp(@Param('id') id: string, @Body('amount') amount: number) { return this.s.topUpWallet(id, amount); }
}
