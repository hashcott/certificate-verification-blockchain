import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { CertificationService } from './certification.service'
import { CurrentUser, Roles } from '../../../common/decorators'
import { Role } from '../../../common/enums'
import { JwtAuthGuard, VerifiedGuard } from '../../../common/guards'

@ApiTags('v1/certification')
@Controller({
	path: 'certification',
	version: '1'
})
export class CertificationController {
	constructor(private readonly certificationervice: CertificationService) {}

	@Roles(Role.MODERATOR)
	@UseGuards(JwtAuthGuard, VerifiedGuard)
	@Patch('confirm')
	confirm(
		@CurrentUser('id') idUser: string,
		@Body('providerId') providerId: string
	) {
		return this.certificationervice.confirm(idUser, providerId)
	}

	@Roles(Role.MODERATOR)
	@UseGuards(JwtAuthGuard, VerifiedGuard)
	@Patch('unconfirm')
	unconfirm(
		@CurrentUser('id') idUser: string,
		@Body('providerId') providerId: string
	) {
		return this.certificationervice.unconfirm(idUser, providerId)
	}

	@Roles(Role.MODERATOR, Role.ADMIN)
	@UseGuards(JwtAuthGuard, VerifiedGuard)
	@Get()
	listCerts() {
		return this.certificationervice.listCerts()
	}
}
