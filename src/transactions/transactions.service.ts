import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import * as QRCode from 'qrcode';
import { Transaction, TransactionStatus, RejectionReason } from './transaction.entity';
import { GenerateQrDto } from './generate-qr.dto';
import { ConfirmTransactionDto } from './confirm-transaction.dto';
import { DriversService } from '../drivers/drivers.service';
import { VehiclesService } from '../vehicles/vehicles.service';
import { CompaniesService } from '../companies/companies.service';
import { StationsService } from '../stations/stations.service';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction) private repo: Repository<Transaction>,
    private driversService: DriversService,
    private vehiclesService: VehiclesService,
    private companiesService: CompaniesService,
    private stationsService: StationsService,
  ) {}

  async generateQr(user_id: string, dto: GenerateQrDto) {
    const driver  = await this.driversService.findByUserId(user_id);
    const vehicle = await this.vehiclesService.findOne(dto.vehicle_id);
    if (vehicle.company_id !== driver.company_id) throw new BadRequestException('Vehicle not in your company');
    if (!vehicle.is_active) throw new BadRequestException('Vehicle is inactive');
    await this.repo.update({ driver_id: driver.id, status: TransactionStatus.PENDING }, { status: TransactionStatus.EXPIRED });
    const qr_token = uuidv4();
    const qr_expires_at = new Date(Date.now() + 10 * 60 * 1000);
    await this.repo.save(this.repo.create({ qr_token, driver_id: driver.id, vehicle_id: vehicle.id, company_id: driver.company_id, status: TransactionStatus.PENDING, qr_expires_at, driver_latitude: dto.driver_latitude, driver_longitude: dto.driver_longitude, odometer_reading: dto.odometer_reading }));
    const qr_image = await QRCode.toDataURL(qr_token, { width: 300, margin: 2 });
    return { qr_token, qr_image, expires_at: qr_expires_at };
  }

  async confirmTransaction(dto: ConfirmTransactionDto) {
    const tx = await this.repo.findOne({ where: { qr_token: dto.qr_token, status: TransactionStatus.PENDING } });
    if (!tx) throw new BadRequestException('Invalid or used QR code');
    if (new Date() > tx.qr_expires_at) { tx.status = TransactionStatus.EXPIRED; await this.repo.save(tx); throw new BadRequestException('QR expired'); }
    const station = await this.stationsService.findOne(dto.station_id);
    if (dto.station_latitude && dto.station_longitude && tx.driver_latitude && tx.driver_longitude) {
      if (!this.stationsService.isWithinRadius(dto.station_latitude, dto.station_longitude, Number(tx.driver_latitude), Number(tx.driver_longitude), station.allowed_radius_meters)) {
        tx.status = TransactionStatus.REJECTED; tx.rejection_reason = RejectionReason.LOCATION_MISMATCH; await this.repo.save(tx);
        throw new BadRequestException('Driver not near station');
      }
    }
    const vehicle = await this.vehiclesService.findOne(tx.vehicle_id);
    const company = await this.companiesService.findOne(tx.company_id);
    const amount_egp = dto.amount_liters * dto.price_per_liter;
    if (Number(company.wallet_balance) < amount_egp) { tx.status = TransactionStatus.REJECTED; tx.rejection_reason = RejectionReason.INSUFFICIENT_BALANCE; await this.repo.save(tx); throw new BadRequestException('Insufficient balance'); }
    const today = new Date(); const todayStart = new Date(today.setHours(0,0,0,0)); const todayEnd = new Date(today.setHours(23,59,59,999));
    const todayTx = await this.repo.find({ where: { vehicle_id: vehicle.id, status: TransactionStatus.COMPLETED, created_at: Between(todayStart, todayEnd) } });
    const todayL = todayTx.reduce((s,t) => s+Number(t.amount_liters), 0);
    if (vehicle.daily_limit > 0 && todayL + dto.amount_liters > Number(vehicle.daily_limit)) { tx.status = TransactionStatus.REJECTED; tx.rejection_reason = RejectionReason.DAILY_LIMIT_EXCEEDED; await this.repo.save(tx); throw new BadRequestException(`Daily limit exceeded`); }
    const monthStart = new Date(); monthStart.setDate(1); monthStart.setHours(0,0,0,0);
    const monthTx = await this.repo.find({ where: { vehicle_id: vehicle.id, status: TransactionStatus.COMPLETED, created_at: Between(monthStart, new Date()) } });
    const monthL = monthTx.reduce((s,t) => s+Number(t.amount_liters), 0);
    if (vehicle.monthly_limit > 0 && monthL + dto.amount_liters > Number(vehicle.monthly_limit)) { tx.status = TransactionStatus.REJECTED; tx.rejection_reason = RejectionReason.MONTHLY_LIMIT_EXCEEDED; await this.repo.save(tx); throw new BadRequestException(`Monthly limit exceeded`); }
    await this.companiesService.deductWallet(company.id, amount_egp);
    tx.status = TransactionStatus.COMPLETED; tx.station_id = station.id; tx.amount_liters = dto.amount_liters; tx.price_per_liter = dto.price_per_liter; tx.amount_egp = amount_egp; tx.completed_at = new Date();
    return this.repo.save(tx);
  }

  async getDriverHistory(user_id: string) { const d = await this.driversService.findByUserId(user_id); return this.repo.find({ where: { driver_id: d.id }, order: { created_at: 'DESC' } }); }
  async getCompanyHistory(company_id: string) { return this.repo.find({ where: { company_id }, order: { created_at: 'DESC' } }); }
  async getAllTransactions() { return this.repo.find({ order: { created_at: 'DESC' } }); }
  async getCompanyStats(company_id: string) {
    const monthStart = new Date(); monthStart.setDate(1); monthStart.setHours(0,0,0,0);
    const txs = await this.repo.find({ where: { company_id, status: TransactionStatus.COMPLETED, created_at: Between(monthStart, new Date()) } });
    return { this_month_transactions: txs.length, this_month_liters: Math.round(txs.reduce((s,t) => s+Number(t.amount_liters),0)*100)/100, this_month_egp: Math.round(txs.reduce((s,t) => s+Number(t.amount_egp),0)*100)/100 };
  }
}
