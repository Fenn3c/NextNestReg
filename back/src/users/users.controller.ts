import { Controller, Post, Get, Body, HttpException, HttpStatus, Res, Req } from '@nestjs/common';
import { Response, Request } from 'express';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginExistsDto } from './dto/login-exists.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { EmailExistsDto } from './dto/email-exists.dto';


@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) { }


  @Get()
  async home() {
    return '123'
  }

  @Post('/create')
  async create(@Body() userData: CreateUserDto): Promise<User | undefined> {
    return this.userService.create(userData);
  }


  @Post('/login-exists')
  async loginExists(@Body() loginExistsData: LoginExistsDto){
    return{
      "userExists":
      Boolean(await this.userService.findByLogin(loginExistsData.login))}
  }


  @Post('/email-exists')
  async emailExists(@Body() emailExistsData: EmailExistsDto){
    return{
      "emailExists":
      Boolean(await this.userService.findByEmail(emailExistsData.email))}
  }

}