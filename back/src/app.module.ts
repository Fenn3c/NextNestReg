import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: 'localhost',
      port: 3306,
      username: 'root',
      charset: 'utf8mb4_unicode_ci',
      password: '',
      database: 'nextnestreg',
      entities: [User],
      synchronize: true,
    }),
    UsersModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule { }
