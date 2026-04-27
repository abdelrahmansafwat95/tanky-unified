import { Body, Controller, Get, Post, Param, UseGuards, Request } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { GenerateQrDto } from './generate-qr.dto';
import { ConfirmTransactionDto } from './confirm-transaction.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/user.entity';

@Controller('transactions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TransactionsController {
  constructor(private readonly s: TransactionsService) {}
  @Post('generate-qr') @Roles(UserRole.DRIVER) generateQr(@Request() req, @Body() dto: GenerateQrDto) { return this.s.generateQr(req.user.id, dto); }
  @Post('confirm') @Roles(UserRole.STATION_USER) confirm(@Body() dto: ConfirmTransactionDto) { return this.s.confirmTransaction(dto); }
  @Get('my-history') @Roles(UserRole.DRIVER) myHistory(@Request() req) { return this.s.getDriverHistory(req.user.id); }
  @Get('company/:id') @Roles(UserRole.PLATFORM_ADMIN, UserRole.COMPANY_ADMIN) companyHistory(@Param('id') id: string) { return this.s.getCompanyHistory(id); }
  @Get('company/:id/stats') @Roles(UserRole.PLATFORM_ADMIN, UserRole.COMPANY_ADMIN) companyStats(@Param('id') id: string) { return this.s.getCompanyStats(id); }
  @Get() @Roles(UserRole.PLATFORM_ADMIN) all() { return this.s.getAllTransactions(); }
}
