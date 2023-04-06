import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';

const PASSWORD_SALT = 10

type JwtPayloadType = {
  login: string,
  sub: number
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly jwtService: JwtService
  ) { }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(id: number): Promise<User | null> {
    return this.usersRepository.findOneBy({ id });
  }

  findByLogin(login: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ login });
  }

  findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ email });
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async create(userData: CreateUserDto): Promise<User> {
    const user = new User();

    if (userData.password !== userData.passwordConfirmation)
      throw new HttpException('Пароли не совпадают', HttpStatus.BAD_REQUEST)

    const userExists = await this.findByLogin(userData.login)
    if (userExists)
      throw new HttpException('Такой логин занят', HttpStatus.BAD_REQUEST)
    user.login = userData.login;
    user.email = userData.email;
    user.password = await bcrypt.hash(userData.password, PASSWORD_SALT);
    return this.usersRepository.save(user);
  }

}
