import {
    IsNotEmpty, IsString, IsEmail,
    MinLength, MaxLength, Matches
} from 'class-validator'

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    @MaxLength(16)
    login: string;

    @IsNotEmpty()
    @IsEmail()
    @MinLength(5)
    @MaxLength(32)
    email: string;

    @IsNotEmpty()
    @IsString()
    @Matches(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,32}$/) // A-Z a-z 0-9 !@#$%^&* min: 8 max: 32
    password: string;

    @IsNotEmpty()
    @IsString()
    @Matches(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,32}$/) // A-Z a-z 0-9 !@#$%^&* min: 8 max: 32
    passwordConfirmation: string;
}
