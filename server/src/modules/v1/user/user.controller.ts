import {
	Body,
	Controller,
	Get,
	Patch,
	Post,
	UploadedFile,
	UseGuards,
	UseInterceptors
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Express } from 'express'
import { UserService } from './user.service'
import {
	CurrentUser,
	Roles,
	Verified as Status
} from '../../../common/decorators'
import { AccountStatus, Role } from '../../../common/enums'
import { JwtAuthGuard, RolesGuard, VerifiedGuard } from '../../../common/guards'
import { UpdateUserDto } from '../../../common/dtos'
import LocalFilesInterceptor from 'common/interceptor/localFiles.interceptor'

@ApiTags('v1/user')
@Controller({
	path: 'user',
	version: '1'
})
export class UserController {
	constructor(private readonly userService: UserService) {}
	@Status(AccountStatus.VERIFIED)
	@UseGuards(JwtAuthGuard, VerifiedGuard)
	@Patch('update')
	updateProfile(
		@CurrentUser('id') id: string,
		@Body() updateData: UpdateUserDto
	) {
		return this.userService.updateProfile(id, updateData)
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(Role.ADMIN, Role.MODERATOR)
	@Get('list')
	listUser() {
		return this.userService.list()
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
	async saveUsers(@UploadedFile() file: Express.Multer.File) {
		return this.userService.saveUsers({
			path: file.path,
			filename: file.originalname,
			mimetype: file.mimetype
		})
	}
}
