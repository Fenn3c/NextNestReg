import { Controller, Post, Get, Body } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';

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
}