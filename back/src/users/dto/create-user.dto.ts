import {
    IsNotEmpty, IsString, IsEmail,
    MinLength, MaxLength, IsStrongPassword, Equals, Matches
} from 'class-validator'

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    @MaxLength(16)
    login: string;

    @IsEmail()
    @MinLength(5)
    @MaxLength(32)
    email: string;

    @IsNotEmpty()
    @IsString()
    @IsStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minNumbers: 1,
        minSymbols: 1,
        minUppercase: 1
    })
    password: string;

    @IsNotEmpty()
    @IsString()
    passwordConfirmation: string;
}
