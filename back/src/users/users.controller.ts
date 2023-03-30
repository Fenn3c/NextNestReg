import { Controller, Post, Get, Body, HttpException, HttpStatus, Res, Req } from '@nestjs/common';
import { Response, Request } from 'express';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { LoginExistsDto } from './dto/login-exists.dto';
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

  @Post('/login')
  async login(@Body() userData: LoginUserDto, @Res({ passthrough: true }) res: Response) {
    const tokens = await this.userService.login(userData);
    res.cookie('refreshToken', tokens.refreshToken, { maxAge: 600_000, httpOnly: true })
    return { accessToken: tokens.accessToken }
  }

  @Post('/login-exists')
  async loginExists(@Body() loginExistsData: LoginExistsDto){
    return{
      "userExists":
      Boolean(await this.userService.findByLogin(loginExistsData.login))}
  }

  @Get('/refresh')
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const { refreshToken } = req.cookies as { refreshToken?: string }
    if (!refreshToken)
      throw new HttpException('Не указан refresh token', HttpStatus.UNAUTHORIZED)
    try {
      const tokens = await this.userService.refreshToken(refreshToken)
      res.cookie('refreshToken', tokens.refreshToken, { maxAge: 600_000, httpOnly: true })
      return { accessToken: tokens.accessToken }
    } catch (err) {
      throw new HttpException('Ошибка обновления токена', HttpStatus.UNAUTHORIZED)
    }
  }
}