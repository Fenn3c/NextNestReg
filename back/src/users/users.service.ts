import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  // findAll(): Promise<User[]> {
  //   return this.usersRepository.find();
  // }

  // findOne(id: number): Promise<User | null> {
  //   return this.usersRepository.findOneBy({ id });
  // }

  // async remove(id: number): Promise<void> {
  //   await this.usersRepository.delete(id);
  // }

  async create(userData: Partial<User>): Promise<User> {
    const user = new User();
    user.login = userData.login;
    user.email = userData.email;
    user.password = await bcrypt.hash(userData.password, 10);
    return this.usersRepository.save(user);
  }
}
