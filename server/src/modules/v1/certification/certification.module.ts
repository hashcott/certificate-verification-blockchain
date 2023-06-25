import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { CertificationController } from './certification.controller'
import { CertificationService } from './certification.service'
import { Certification, LocalFile, User } from 'common/entities'
import { BullModule } from '@nestjs/bull'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { LocalFilesService } from './localFiles.service'

@Module({
	imports: [
		TypeOrmModule.forFeature([User, LocalFile, Certification]),
		BullModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: async (configService: ConfigService) => ({
				redis: {
					host: configService.get('REDIS_HOST') || 'localhost',
					port: configService.get('REDIS_PORT') || 6379
				}
			}),
			inject: [ConfigService]
		}),
		BullModule.registerQueue({
			name: 'cert'
		})
	],
	controllers: [CertificationController],
	providers: [CertificationService, LocalFilesService],
	exports: [CertificationService]
})
export class CertificationModule {}
