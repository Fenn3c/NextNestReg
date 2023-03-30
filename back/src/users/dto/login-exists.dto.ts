import {
    IsNotEmpty, IsString
} from 'class-validator'

export class LoginExistsDto{
    @IsNotEmpty()
    @IsString()
    login: string;
}