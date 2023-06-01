import { Module } from '@nestjs/common'
import { AuthModule } from './auth/auth.module'
import { UserModule } from './user/user.module'
import { CertificationModule } from './certification/certification.module'

@Module({
	imports: [AuthModule, UserModule, CertificationModule]
})
export class V1Module {}
