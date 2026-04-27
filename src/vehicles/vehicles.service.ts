import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle } from './vehicle.entity';
import { CreateVehicleDto } from './create-vehicle.dto';
import { CompaniesService } from '../companies/companies.service';

@Injectable()
export class VehiclesService {
  constructor(@InjectRepository(Vehicle) private repo: Repository<Vehicle>, private companiesService: CompaniesService) {}

  async create(dto: CreateVehicleDto) {
    await this.companiesService.findOne(dto.company_id);
    const existing = await this.repo.findOne({ where: { plate_number: dto.plate_number } });
    if (existing) throw new BadRequestException('Plate already registered');
    return this.repo.save(this.repo.create(dto));
  }

  async findAll() { return this.repo.find(); }
  async findByCompany(company_id: string) { return this.repo.find({ where: { company_id } }); }
  async findOne(id: string) {
    const v = await this.repo.findOne({ where: { id } });
    if (!v) throw new NotFoundException('Vehicle not found');
    return v;
  }
}
