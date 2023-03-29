import {
    IsNotEmpty, IsString, IsEmail,
    MinLength, MaxLength, IsStrongPassword, Equals, Matches
} from 'class-validator'

export class LoginUserDto{
    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    @MaxLength(16)
    login: string;

    @IsNotEmpty()
    @IsString()
    password: string;
}