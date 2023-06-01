import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { CertificationController } from './certification.controller'
import { CertificationService } from './certification.service'
import { Certification, User } from 'common/entities'

@Module({
	imports: [TypeOrmModule.forFeature([User, Certification])],
	controllers: [CertificationController],
	providers: [CertificationService],
	exports: [CertificationService]
})
export class CertificationModule {}
