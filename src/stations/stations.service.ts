import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Station } from './station.entity';
import { CreateStationDto } from './create-station.dto';

@Injectable()
export class StationsService {
  constructor(@InjectRepository(Station) private repo: Repository<Station>) {}

  async create(dto: CreateStationDto) {
    if (await this.repo.findOne({ where: { name: dto.name } })) throw new BadRequestException('Station already exists');
    return this.repo.save(this.repo.create(dto));
  }

  async findAll() { return this.repo.find(); }
  async findOne(id: string) {
    const s = await this.repo.findOne({ where: { id } });
    if (!s) throw new NotFoundException('Station not found');
    return s;
  }

  isWithinRadius(sLat: number, sLng: number, dLat: number, dLng: number, radius: number): boolean {
    const R = 6371000;
    const dLa = ((dLat - sLat) * Math.PI) / 180;
    const dLo = ((dLng - sLng) * Math.PI) / 180;
    const a = Math.sin(dLa/2)**2 + Math.cos(sLat*Math.PI/180)*Math.cos(dLat*Math.PI/180)*Math.sin(dLo/2)**2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)) <= radius;
  }
}
