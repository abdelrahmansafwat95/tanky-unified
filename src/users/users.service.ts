import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async create(dto: CreateUserDto) {
    const existing = await this.repo.findOne({ where: { phone: dto.phone } });
    if (existing) throw new BadRequestException('Phone already registered');
    const password_hash = await bcrypt.hash(dto.password, 10);
    const user = this.repo.create({ ...dto, password_hash });
    const saved = await this.repo.save(user);
    const { password_hash: _, ...result } = saved;
    return result;
  }

  async findAll() {
    const users = await this.repo.find();
    return users.map(({ password_hash, ...rest }) => rest);
  }

  async findByPhone(phone: string): Promise<User | null> {
    return this.repo.findOne({ where: { phone } });
  }
}
