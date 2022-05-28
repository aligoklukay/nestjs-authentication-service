import {IsEmail, IsNotEmpty, Matches, MinLength} from 'class-validator'

export class AuthenticationRegisterDto {
    @IsNotEmpty()
    @IsEmail()
    email: string

    @IsNotEmpty()
    @MinLength(8)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'There must be at least 1 number, 1 uppercase letter and 1 lowercase letter',
    })
    password: string
}
