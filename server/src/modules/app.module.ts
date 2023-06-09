import { Module } from '@nestjs/common'
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
import { APP_GUARD } from '@nestjs/core'
import { RedisModule, RedisModuleOptions } from '@liaoliaots/nestjs-redis'
import { V1Module } from './v1/v1.module'
import { MainController } from './app.controller'

import { LocalFile, User } from '../common/entities'
import { Certification } from 'common/entities/certification.entity'

@Module({
	imports: [
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => {
				return {
					type: configService.get('DB_TYPE'),
					host: configService.get('DB_HOST'),
					port: configService.get('DB_PORT'),
					username: configService.get('DB_USERNAME'),
					password: configService.get('DB_PASSWORD'),
					database: configService.get('DB_DATABASE'),
					entities: [User, LocalFile, Certification],
					synchronize: true
				} as TypeOrmModuleAsyncOptions
			}
		}),
		ConfigModule.forRoot({
			isGlobal: true
		}),
		ThrottlerModule.forRoot({
			ttl: 60,
			limit: 1000000
		}),
		RedisModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: async (
				configService: ConfigService
			): Promise<RedisModuleOptions> => {
				return {
					config: {
						host: configService.get('REDIS_HOST') || 'localhost',
						port: configService.get('REDIS_PORT') || 6379
					}
				}
			}
		}),
		V1Module
	],
	controllers: [MainController],
	providers: [
		{
			provide: APP_GUARD,
			useClass: ThrottlerGuard
		}
	]
})
export class AppModule {}
