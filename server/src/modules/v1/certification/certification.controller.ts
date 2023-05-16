import { Body, Controller, Patch, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { UserService } from './certification.service'
import { CurrentUser, Roles } from '../../../common/decorators'
import { Role } from '../../../common/enums'
import { JwtAuthGuard, VerifiedGuard } from '../../../common/guards'
import { UpdateUserDto } from '../../../common/dtos'

@ApiTags('v1/certification')
@Controller({
	path: 'certification',
	version: '1'
})
export class UserController {
	constructor(private readonly userService: UserService) {}
	@Roles(Role.MODERATOR)
	@UseGuards(JwtAuthGuard, VerifiedGuard)
	@Patch('update')
	updateProfile(
		@CurrentUser('id') id: string,
		@Body() updateData: UpdateUserDto
	) {
		return this.userService.updateProfile(id, updateData)
	}
}
