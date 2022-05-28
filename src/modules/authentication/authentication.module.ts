import {Module} from '@nestjs/common'
import {JwtModule} from '@nestjs/jwt'
import {PassportModule} from '@nestjs/passport'
import {TypeOrmModule} from '@nestjs/typeorm'

import {AuthController} from './authentication.controller'
import {AuthService} from './authentication.service'
import {JwtStrategy} from './strategy/jwt.strategy'
import {ConfigModule} from 'src/config/config.module'
import {ConfigService} from 'src/config/config.service'
import {User} from 'src/entities/user.entity'

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        ConfigModule,
        PassportModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: (config: ConfigService) => {
                return {
                    secret: config.auth.secret,
                }
            },
            inject: [ConfigService],
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
