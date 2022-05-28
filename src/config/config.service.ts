import {Injectable} from '@nestjs/common'
import * as dotenv from 'dotenv'
import * as Yup from 'yup'

@Injectable()
export class ConfigService {
    app: {
        port: number
        cors: {
            origin?: string[]
        }
    }

    mongo: {
        uri: string
        database: string
    }

    elastic: {
        node: string
        username: string
        password: string
    }

    postgres: {
        host: string
        port: number
        user: string
        ssl: boolean
        password: string
        database: string
    }

    auth: {
        secret: string
    }

    constructor() {
        ConfigService.loadFromEnvFile()
        const vars = Object.assign({}, process.env) as any
        try {
            this.registerApp(vars)
            this.registerPostgre(vars)
            this.registerElastic(vars)
            this.registerAuth(vars)
        } catch (error: any) {
            throw new Error(`Config validation error: ${error.message}`)
        }
    }

    private static loadFromEnvFile() {
        if (process.env.ENV === 'test') {
            dotenv.config({path: '.env.test'})
            return
        }
        dotenv.config()
    }

    private registerApp(vars: {[varName: string]: any}) {
        const appSchema = Yup.object().shape({
            ENV: Yup.string().oneOf(['development', 'test', 'production']).default('production'),
            APP_PORT: Yup.number().default(3000),
            APP_CORS_ORIGIN: Yup.string().optional(),
        })
        const config = appSchema.validateSync(vars, {stripUnknown: true})
        this.app = {
            port: config.APP_PORT,
            cors: {
                origin: config.APP_CORS_ORIGIN === '' ? undefined : config.APP_CORS_ORIGIN?.split(','),
            },
        }
    }

    private registerPostgre(vars: {[varName: string]: any}) {
        const appSchema = Yup.object().shape({
            POSTGRES_HOST: Yup.string().required(),
            POSTGRES_PORT: Yup.number().required(),
            POSTGRES_SSL: Yup.boolean().default(false),
            POSTGRES_USER: Yup.string().required(),
            POSTGRES_PASSWORD: Yup.string().required(),
            POSTGRES_DATABASE: Yup.string().required(),
        })
        const config = appSchema.validateSync(vars, {stripUnknown: true})
        this.postgres = {
            host: config.POSTGRES_HOST,
            port: config.POSTGRES_PORT,
            user: config.POSTGRES_USER,
            ssl: config.POSTGRES_SSL,
            password: config.POSTGRES_PASSWORD,
            database: config.POSTGRES_DATABASE,
        }
    }

    private registerElastic(vars: {[varName: string]: any}) {
        const appSchema = Yup.object().shape({
            ELASTIC_NODE: Yup.string().required(),
            ELASTIC_USERNAME: Yup.string().optional(),
            ELASTIC_PASSWORD: Yup.string().optional(),
        })
        const config = appSchema.validateSync(vars, {stripUnknown: true})
        this.elastic = {
            node: config.ELASTIC_NODE,
            username: config.ELASTIC_USERNAME,
            password: config.ELASTIC_PASSWORD,
        }
    }

    private registerAuth(vars: {[varName: string]: any}) {
        const appSchema = Yup.object().shape({
            JWT_SECRET: Yup.string().required(),
        })
        const config = appSchema.validateSync(vars, {stripUnknown: true})
        this.auth = {
            secret: config.JWT_SECRET,
        }
    }
}
