import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { LocalFileDto } from 'common/dtos/localFile.dto'
import { LocalFile } from 'common/entities'
import { LocalFileRepository } from '../user/repositories/localFilee.repository'

@Injectable()
export class LocalFilesService {
	constructor(
		@InjectRepository(LocalFile)
		private localFilesRepository: LocalFileRepository
	) {}

	async saveLocalFileData(fileData: LocalFileDto) {
		const newFile = this.localFilesRepository.create(fileData)
		console.log(newFile)

		await this.localFilesRepository.save(newFile)
		return newFile
	}
}
