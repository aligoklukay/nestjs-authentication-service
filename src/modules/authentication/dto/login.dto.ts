import {IsEmail, IsNotEmpty, IsString, MinLength} from 'class-validator'

export class AuthenticationLoginDto {
    @IsNotEmpty()
    @IsEmail()
    email: string

    @IsString()
    @MinLength(8)
    @IsNotEmpty()
    password: string
}
