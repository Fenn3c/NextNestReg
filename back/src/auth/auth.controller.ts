import { Body, Controller, Get, Post, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { SignInUserDto } from './dto/signIn.dto';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }


    @Post('/signin')
    async login(@Body() userData: SignInUserDto, @Res({ passthrough: true }) res: Response): Promise<{ accessToken: any; }> {
      const tokens = await this.authService.signIn(userData);
      res.cookie('refreshToken', tokens.refreshToken, { maxAge: 600_000, httpOnly: true })
      return { accessToken: tokens.accessToken }
    }

    @UseGuards(AuthGuard)
    @Get('profile')
    getProfile(@Req() req) {
      return 'РАБОТАЕТ';
    }


    @Get('/refresh')
    async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
      const { refreshToken } = req.cookies as { refreshToken?: string }
      if (!refreshToken)
        throw new UnauthorizedException()
      try {
        const tokens = await this.authService.refreshToken(refreshToken)
        res.cookie('refreshToken', tokens.refreshToken, { maxAge: 600_000, httpOnly: true })
        return { accessToken: tokens.accessToken }
      } catch (err) {
        throw new UnauthorizedException()
      }
    }
}
