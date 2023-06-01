import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Certification, LocalFile, User } from '../../../common/entities'
import { UserController } from './/user.controller'
import { UserService } from './user.service'
import { LocalFilesService } from './localFiles.service'

@Module({
	imports: [TypeOrmModule.forFeature([User, LocalFile, Certification])],
	controllers: [UserController],
	providers: [UserService, LocalFilesService],
	exports: [UserService]
})
export class UserModule {}
