import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('stations')
export class Station {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ unique: true }) name: string;
  @Column() address: string;
  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true }) latitude: number;
  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true }) longitude: number;
  @Column({ unique: true }) phone: string;
  @Column({ default: true }) is_active: boolean;
  @Column({ default: 200 }) allowed_radius_meters: number;
  @CreateDateColumn() created_at: Date;
  @UpdateDateColumn() updated_at: Date;
}
