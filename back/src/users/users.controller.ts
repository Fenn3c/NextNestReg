import { Controller, Post, Get, Body } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService,
              private readonly jwtService: JwtService
              )
               { }


  @Get()
  async home() {
    return '123'
  }

  @Post('/create')
  async create(@Body() userData: CreateUserDto): Promise<User | undefined> {
    return this.userService.create(userData);
  }

  @Post('/login')
  async login(@Body() userData: LoginUserDto) {
    return this.userService.login(userData);
  }

  @Get('/refresh')
  async refresh(@Body() refreshTokenDto: RefreshTokenDto){
    return this.userService.refreshToken(refreshTokenDto);
  }



}