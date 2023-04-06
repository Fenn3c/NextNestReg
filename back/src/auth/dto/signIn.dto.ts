import {
    IsNotEmpty, IsString, IsEmail,
    MinLength, MaxLength, IsStrongPassword, Equals, Matches
} from 'class-validator'

export class SignInUserDto{
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;
}