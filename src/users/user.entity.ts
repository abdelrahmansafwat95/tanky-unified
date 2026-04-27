import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum UserRole {
  PLATFORM_ADMIN = 'platform_admin',
  COMPANY_ADMIN  = 'company_admin',
  DRIVER         = 'driver',
  STATION_USER   = 'station_user',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() full_name: string;
  @Column({ unique: true }) phone: string;
  @Column() password_hash: string;
  @Column({ type: 'enum', enum: UserRole, default: UserRole.DRIVER }) role: UserRole;
  @Column({ default: true }) is_active: boolean;
  @CreateDateColumn() created_at: Date;
  @UpdateDateColumn() updated_at: Date;
}
