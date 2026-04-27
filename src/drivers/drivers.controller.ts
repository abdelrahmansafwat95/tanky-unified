import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { DriversService } from './drivers.service';
import { CreateDriverDto } from './create-driver.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/user.entity';

@Controller('drivers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DriversController {
  constructor(private readonly s: DriversService) {}
  @Post() @Roles(UserRole.PLATFORM_ADMIN, UserRole.COMPANY_ADMIN) create(@Body() dto: CreateDriverDto) { return this.s.create(dto); }
  @Get() @Roles(UserRole.PLATFORM_ADMIN) findAll() { return this.s.findAll(); }
  @Get('company/:id') @Roles(UserRole.PLATFORM_ADMIN, UserRole.COMPANY_ADMIN) findByCompany(@Param('id') id: string) { return this.s.findByCompany(id); }
  @Get(':id') @Roles(UserRole.PLATFORM_ADMIN, UserRole.COMPANY_ADMIN) findOne(@Param('id') id: string) { return this.s.findOne(id); }
}
