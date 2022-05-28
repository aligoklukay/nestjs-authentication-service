import {Controller, Body, Inject, UseFilters} from '@nestjs/common'
import {MessagePattern, RpcException} from '@nestjs/microservices'
import {ExceptionFilter} from 'src/filter/rpc-exception.filter'

import {AuthService} from './authentication.service'
import {AuthenticationLoginDto} from './dto/login.dto'
import {AuthenticationRegisterDto} from './dto/register.dto'

@Controller('auth')
export class AuthController {
    @Inject() private readonly authService: AuthService

    @UseFilters(new ExceptionFilter())
    @MessagePattern({cmd: 'signup'})
    public async register(@Body() body: AuthenticationRegisterDto): Promise<any> {
        const userAlreadyExists = await this.authService.userAlreadyExistsWithEmail(body.email)

        if (userAlreadyExists) {
            throw new RpcException({
                status: 500,
                code: 'users.already_exists',
                message: 'User already exists',
            })
        }
        return await this.authService.register(body)
    }

    @MessagePattern({cmd: 'login'})
    public async login(@Body() body: AuthenticationLoginDto): Promise<any> {
        return await this.authService.login(body)
    }
}
