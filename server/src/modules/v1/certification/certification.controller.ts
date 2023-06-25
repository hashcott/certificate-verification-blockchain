import {
	Body,
	Controller,
	Get,
	Param,
	Patch,
	UseGuards,
	Post,
	UploadedFile,
	UseInterceptors,
	Query
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { CertificationService } from './certification.service'
import { CurrentUser, Roles } from '../../../common/decorators'
import { Role } from '../../../common/enums'
import { JwtAuthGuard, RolesGuard, VerifiedGuard } from '../../../common/guards'
import LocalFilesInterceptor from 'common/interceptor/localFiles.interceptor'
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

	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(Role.ADMIN, Role.MODERATOR)
	@Get('list')
	listUser() {
		return this.certificationervice.list()
	}

	@Get('getOne')
	getOne(@Param('providerId') providerId: string) {
		return this.certificationervice.getOne(providerId)
	}

	@Get('search')
	search(@Query('q') query) {
		return this.certificationervice.search(query)
	}
	@Post('xlsx')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(Role.ADMIN)
	@UseInterceptors(
		LocalFilesInterceptor({
			fieldName: 'file',
			path: ''
		})
	)
	async saveCerts(@UploadedFile() file: Express.Multer.File) {
		return this.certificationervice.saveCerts({
			path: file.path,
			filename: file.originalname,
			mimetype: file.mimetype
		})
	}
}
