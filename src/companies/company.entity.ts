import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum SubscriptionPlan { BASIC = 'basic', PROFESSIONAL = 'professional', ENTERPRISE = 'enterprise' }

@Entity('companies')
export class Company {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ unique: true }) name: string;
  @Column({ unique: true }) commercial_register: string;
  @Column({ unique: true }) phone: string;
  @Column({ nullable: true }) email: string;
  @Column({ nullable: true }) address: string;
  @Column({ type: 'enum', enum: SubscriptionPlan, default: SubscriptionPlan.BASIC }) subscription_plan: SubscriptionPlan;
  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 }) wallet_balance: number;
  @Column({ default: true }) is_active: boolean;
  @CreateDateColumn() created_at: Date;
  @UpdateDateColumn() updated_at: Date;
}
