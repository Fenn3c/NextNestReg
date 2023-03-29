import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './user.entity';
import { JwtModule } from '@nestjs/jwt';
import { JWT_ACCESS_EXPIRES, JWT_ACCESS_SECRET } from './constants';


@Module({
    imports: [TypeOrmModule.forFeature([User]),
    JwtModule.register({
        secret: JWT_ACCESS_SECRET,
        signOptions: { expiresIn: JWT_ACCESS_EXPIRES },
    })],
    providers: [UsersService],
    exports: [TypeOrmModule],
    controllers: [UsersController],
})
export class UsersModule { }