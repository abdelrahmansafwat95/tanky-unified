import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Driver } from '../drivers/driver.entity';
import { Vehicle } from '../vehicles/vehicle.entity';
import { Station } from '../stations/station.entity';
import { Company } from '../companies/company.entity';

export enum TransactionStatus { PENDING = 'pending', COMPLETED = 'completed', REJECTED = 'rejected', EXPIRED = 'expired' }
export enum RejectionReason { INSUFFICIENT_BALANCE = 'insufficient_balance', DAILY_LIMIT_EXCEEDED = 'daily_limit_exceeded', MONTHLY_LIMIT_EXCEEDED = 'monthly_limit_exceeded', INVALID_QR = 'invalid_qr', EXPIRED_QR = 'expired_qr', LOCATION_MISMATCH = 'location_mismatch', DUPLICATE = 'duplicate', VEHICLE_INACTIVE = 'vehicle_inactive' }

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ unique: true }) qr_token: string;
  @ManyToOne(() => Driver, { eager: true }) @JoinColumn({ name: 'driver_id' }) driver: Driver;
  @Column() driver_id: string;
  @ManyToOne(() => Vehicle, { eager: true }) @JoinColumn({ name: 'vehicle_id' }) vehicle: Vehicle;
  @Column() vehicle_id: string;
  @ManyToOne(() => Company, { eager: true }) @JoinColumn({ name: 'company_id' }) company: Company;
  @Column() company_id: string;
  @ManyToOne(() => Station, { eager: true, nullable: true }) @JoinColumn({ name: 'station_id' }) station: Station;
  @Column({ nullable: true }) station_id: string;
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true }) amount_liters: number;
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true }) amount_egp: number;
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true }) price_per_liter: number;
  @Column({ type: 'enum', enum: TransactionStatus, default: TransactionStatus.PENDING }) status: TransactionStatus;
  @Column({ type: 'enum', enum: RejectionReason, nullable: true }) rejection_reason: RejectionReason;
  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true }) driver_latitude: number;
  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true }) driver_longitude: number;
  @Column({ type: 'timestamp' }) qr_expires_at: Date;
  @Column({ nullable: true }) odometer_reading: number;
  @CreateDateColumn() created_at: Date;
  @Column({ nullable: true }) completed_at: Date;
}
