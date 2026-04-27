import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from './company.entity';
import { CreateCompanyDto } from './create-company.dto';

@Injectable()
export class CompaniesService {
  constructor(@InjectRepository(Company) private repo: Repository<Company>) {}

  async create(dto: CreateCompanyDto) {
    const existing = await this.repo.findOne({ where: { name: dto.name } });
    if (existing) throw new BadRequestException('Company name already exists');
    return this.repo.save(this.repo.create(dto));
  }

  async findAll() { return this.repo.find(); }

  async findOne(id: string) {
    const c = await this.repo.findOne({ where: { id } });
    if (!c) throw new NotFoundException('Company not found');
    return c;
  }

  async topUpWallet(id: string, amount: number) {
    const c = await this.findOne(id);
    c.wallet_balance = Number(c.wallet_balance) + amount;
    return this.repo.save(c);
  }

  async deductWallet(id: string, amount: number) {
    const c = await this.findOne(id);
    if (Number(c.wallet_balance) < amount) throw new BadRequestException('Insufficient balance');
    c.wallet_balance = Number(c.wallet_balance) - amount;
    return this.repo.save(c);
  }
}
