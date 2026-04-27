import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Company } from '../companies/company.entity';

export enum FuelType { PETROL_80 = 'petrol_80', PETROL_92 = 'petrol_92', PETROL_95 = 'petrol_95', DIESEL = 'diesel', NATURAL_GAS = 'natural_gas' }

@Entity('vehicles')
export class Vehicle {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ unique: true }) plate_number: string;
  @Column() model: string;
  @Column({ nullable: true }) year: number;
  @Column({ type: 'enum', enum: FuelType, default: FuelType.PETROL_92 }) fuel_type: FuelType;
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 }) daily_limit: number;
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 }) monthly_limit: number;
  @Column({ nullable: true }) odometer: number;
  @Column({ default: true }) is_active: boolean;
  @ManyToOne(() => Company, { eager: true }) @JoinColumn({ name: 'company_id' }) company: Company;
  @Column() company_id: string;
  @CreateDateColumn() created_at: Date;
  @UpdateDateColumn() updated_at: Date;
}
