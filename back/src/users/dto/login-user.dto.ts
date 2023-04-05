import {
    IsNotEmpty, IsString, IsEmail,
    MinLength, MaxLength, IsStrongPassword, Equals, Matches
} from 'class-validator'

export class LoginUserDto{
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;
}