import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { JWT_REFRESH_EXPIRES, JWT_REFRESH_SECRET } from './constants';

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

  async refreshToken(refreshToken: string) {
      const res = this.jwtService.verify<JwtPayloadType>(refreshToken, { secret: JWT_REFRESH_SECRET })
      const user = await this.usersRepository.findOneByOrFail({id: res.sub})
      if(user.refreshToken !== refreshToken){
        throw new Error()
      }
      const tokens =  this.generateTokens({login: res.login, sub: res.sub})

      user.refreshToken = tokens.refreshToken
      await this.usersRepository.save(user)
      return tokens
  }


  private generateTokens(payload: JwtPayloadType){
    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload,
        { expiresIn: JWT_REFRESH_EXPIRES, secret: JWT_REFRESH_SECRET })
    }
  }

  async login(userData: LoginUserDto) {
    const { password, email } = userData
    const user = await this.findByEmail(email)
    if (!user)
      throw new HttpException('Почта или пароль неверные', HttpStatus.UNAUTHORIZED)

    const checkPassword = await bcrypt.compare(password, user.password)
    if (!checkPassword)
      throw new HttpException('Почта или пароль неверные', HttpStatus.UNAUTHORIZED)


    const payload: JwtPayloadType = {
      login: user.login,
      sub: user.id
    }
    const tokens = this.generateTokens(payload)
    user.refreshToken = tokens.refreshToken

    await this.usersRepository.save(user)
    return tokens

  }
}
