import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JWT_REFRESH_EXPIRES, JWT_REFRESH_SECRET } from './constants';
import { Repository } from 'typeorm';
import { User } from 'src/users/user.entity';
import { InjectRepository } from '@nestjs/typeorm';




@Injectable()
export class AuthService {

    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    @InjectRepository(User)
        private readonly usersRepository: Repository<User>,

    ) { }

    private async generateTokens(payload: JwtPayloadType) {
        return {
            accessToken: await this.jwtService.signAsync(payload),
            refreshToken: await this.jwtService.signAsync(payload,
                { expiresIn: JWT_REFRESH_EXPIRES, secret: JWT_REFRESH_SECRET })
        }
    }

    async signIn(userData) {
        const { password, email } = userData
        const user = await this.usersService.findByEmail(email)
        if (!user)
            throw new UnauthorizedException('Почта или пароль неверные')

        const checkPassword = await bcrypt.compare(password, user.password)
        if (!checkPassword)
            throw new UnauthorizedException('Почта или пароль неверные')



        const payload: JwtPayloadType = {
            login: user.login,
            sub: user.id
        }
        const tokens = await this.generateTokens(payload)
        user.refreshToken = tokens.refreshToken

        await this.usersRepository.save(user)
        return tokens

    }


    async refreshToken(refreshToken: string) {
        const res = this.jwtService.verify<JwtPayloadType>(refreshToken, { secret: JWT_REFRESH_SECRET })
        const user = await this.usersRepository.findOneByOrFail({id: res.sub})
        if(user.refreshToken !== refreshToken){
          throw new UnauthorizedException()
        }
        const tokens = await this.generateTokens({login: res.login, sub: res.sub})
  
        user.refreshToken = tokens.refreshToken
        await this.usersRepository.save(user)
        return tokens
    }
}

