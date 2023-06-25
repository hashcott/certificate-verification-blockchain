import {
	Body,
	Controller,
	Get,
	Param,
	Patch,
	Post,
	Query,
	UploadedFile,
	UseGuards,
	UseInterceptors
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { UserService } from './user.service'
import {
	CurrentUser,
	Roles,
	Verified as Status
} from '../../../common/decorators'
import { AccountStatus, Role } from '../../../common/enums'
import { JwtAuthGuard, RolesGuard, VerifiedGuard } from '../../../common/guards'
import { UpdateUserDto } from '../../../common/dtos'

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
	@Roles(Role.ADMIN)
	@Get('list-manager')
	listManager() {
		return this.userService.listManager()
	}
}
