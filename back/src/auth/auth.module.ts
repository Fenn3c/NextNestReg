import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { JWT_ACCESS_EXPIRES, JWT_ACCESS_SECRET } from './constants';

@Module({
  imports: [TypeOrmModule.forFeature([User]),
  JwtModule.register({
      secret: JWT_ACCESS_SECRET,
      signOptions: { expiresIn: JWT_ACCESS_EXPIRES },
  })],
  controllers: [AuthController],
  exports: [TypeOrmModule],
  providers: [AuthService, UsersService]
})
export class AuthModule {}
