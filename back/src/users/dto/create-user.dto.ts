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
    // @Matches(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,32}$/) // A-Z a-z 0-9 !@#$%^&* min: 8 max: 32
    @IsStrongPassword()
    password: string;

    @IsNotEmpty()
    @IsString()
    // @IsStrongPassword()
    // @Matches(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,32}$/) // A-Z a-z 0-9 !@#$%^&* min: 8 max: 32
    // @Matches('password')

    passwordConfirmation: string;
}
