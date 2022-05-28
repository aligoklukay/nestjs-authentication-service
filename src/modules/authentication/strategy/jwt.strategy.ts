import {ExtractJwt, Strategy} from 'passport-jwt'
import {Injectable, UnauthorizedException} from '@nestjs/common'
import {PassportStrategy} from '@nestjs/passport'

import {ConfigService} from 'src/config/config.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(config: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.auth.secret,
        })
    }

    async validate(payload) {
        if (!payload) {
            throw new UnauthorizedException()
        }
        delete payload.password

        return payload
    }
}
