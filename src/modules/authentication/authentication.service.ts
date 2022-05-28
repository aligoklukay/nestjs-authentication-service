import {
    Inject,
    Injectable,
} from '@nestjs/common'
import {JwtService} from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import {RpcException} from '@nestjs/microservices'
import {InjectRepository} from '@nestjs/typeorm'
import {Repository} from 'typeorm'

import {AuthenticationRegisterDto} from './dto/register.dto'
import {AuthenticationLoginDto} from './dto/login.dto'
import {User} from 'src/entities/user.entity'

@Injectable()
export class AuthService {
    @Inject() private readonly jwtService: JwtService
    @InjectRepository(User) public userRepository: Repository<User>

    async userAlreadyExistsWithEmail(email: string): Promise<boolean> {
        const user = await this.userRepository.findOne({
            where: {
                email,
            },
        })
        return user ? true : false
    }

    async register(body: AuthenticationRegisterDto): Promise<any> {
        try {
            const user = this.userRepository.create({
                email: body.email,
                password: body.password,
            })

            return await this.userRepository.save(user)
        } catch (error) {
            throw new RpcException(error)
        }
    }

    public async login(body: AuthenticationLoginDto): Promise<any | {status: number; message: string}> {
        try {
            const user = await this.validate(body)
            if (!user) {
                throw new RpcException(`The email address or the password is wrong.`)
            }

            const passwordIsValid = await bcrypt.compareSync(body.password, user.password)

            if (!passwordIsValid) {
                throw new RpcException(`The email address or the password is wrong.`)
            }

            const jwtPayload = await this.generateJwtPayload(user.id)

            return {...jwtPayload}
        } catch (error) {
            throw new RpcException(error)
        }
    }

    private async generateJwtPayload(userId) {
        const user = await this.userRepository.findOne({
            where: {
                id: userId,
            },
        })

        const payload = {
            id: user.id,
        }


        const accessToken = await this.jwtService.sign(payload)

        return {
            accessToken,
        }
    }

    private async validate(body: AuthenticationLoginDto): Promise<User> {
        const user = await this.userRepository.findOne({
            where: {
                email: body.email,
            },
        })
        return user
    }
}
