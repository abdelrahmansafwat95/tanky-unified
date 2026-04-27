import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Driver } from './driver.entity';
import { CreateDriverDto } from './create-driver.dto';

@Injectable()
export class DriversService {
  constructor(@InjectRepository(Driver) private repo: Repository<Driver>) {}

  async create(dto: CreateDriverDto) {
    if (await this.repo.findOne({ where: { user_id: dto.user_id } })) throw new BadRequestException('User already a driver');
    if (dto.vehicle_id && await this.repo.findOne({ where: { vehicle_id: dto.vehicle_id } })) throw new BadRequestException('Vehicle already assigned');
    return this.repo.save(this.repo.create(dto));
  }

  async findAll() { return this.repo.find(); }
  async findByCompany(company_id: string) { return this.repo.find({ where: { company_id } }); }
  async findOne(id: string) {
    const d = await this.repo.findOne({ where: { id } });
    if (!d) throw new NotFoundException('Driver not found');
    return d;
  }
  async findByUserId(user_id: string) {
    const d = await this.repo.findOne({ where: { user_id } });
    if (!d) throw new NotFoundException('Driver not found');
    return d;
  }
}
