import {
    IsNotEmpty, IsString
} from 'class-validator'

export class EmailExistsDto{
    @IsNotEmpty()
    @IsString()
    email: string;
}