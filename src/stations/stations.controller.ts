import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { StationsService } from './stations.service';
import { CreateStationDto } from './create-station.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/user.entity';

@Controller('stations')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StationsController {
  constructor(private readonly s: StationsService) {}
  @Post() @Roles(UserRole.PLATFORM_ADMIN) create(@Body() dto: CreateStationDto) { return this.s.create(dto); }
  @Get() @Roles(UserRole.PLATFORM_ADMIN, UserRole.COMPANY_ADMIN) findAll() { return this.s.findAll(); }
  @Get(':id') @Roles(UserRole.PLATFORM_ADMIN, UserRole.COMPANY_ADMIN, UserRole.STATION_USER) findOne(@Param('id') id: string) { return this.s.findOne(id); }
}
