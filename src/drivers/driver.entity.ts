import { Entity, PrimaryGeneratedColumn, OneToOne, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, Column } from 'typeorm';
import { User } from '../users/user.entity';
import { Vehicle } from '../vehicles/vehicle.entity';
import { Company } from '../companies/company.entity';

@Entity('drivers')
export class Driver {
  @PrimaryGeneratedColumn('uuid') id: string;
  @OneToOne(() => User, { eager: true }) @JoinColumn({ name: 'user_id' }) user: User;
  @Column({ unique: true }) user_id: string;
  @OneToOne(() => Vehicle, { eager: true, nullable: true }) @JoinColumn({ name: 'vehicle_id' }) vehicle: Vehicle;
  @Column({ nullable: true, unique: true }) vehicle_id: string;
  @ManyToOne(() => Company, { eager: true }) @JoinColumn({ name: 'company_id' }) company: Company;
  @Column() company_id: string;
  @Column({ default: true }) is_active: boolean;
  @CreateDateColumn() created_at: Date;
  @UpdateDateColumn() updated_at: Date;
}
