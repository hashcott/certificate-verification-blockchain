import {
	BadRequestException,
	Injectable,
	InternalServerErrorException
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'

import { Certification, User } from '../../../common/entities'
import {
	AccountStatus,
	DegreeClassfication,
	PostgresErrorCode,
	Providers,
	Role
} from '../../../common/enums'
import { UniqueViolation } from '../../../common/exceptions'
import { Repository } from 'typeorm'
import { LocalFileDto } from 'common/dtos/localFile.dto'
import { join } from 'path'
import readXlsxFile from 'read-excel-file/node'
import { LocalFilesService } from './localFiles.service'
@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		private localFilesService: LocalFilesService
	) {}

	public async create(data: Partial<User>, cert?: Certification) {
		try {
			const user = this.userRepository.create(data)
			if (cert) {
				console.log(cert)

				user.certification = cert
			}
			await this.userRepository.save(user)
			return user
		} catch (error) {
			throw new Error(data.providerId)
		}
	}
	public async saveUsers(fileData: LocalFileDto) {
		await this.localFilesService.saveLocalFileData(fileData)
		const usersPromise: Promise<User>[] = []
		try {
			await readXlsxFile(join(process.cwd(), fileData.path)).then(
				(rows) => {
					rows.shift()
					rows.forEach((row) => {
						console.log(row)

						const [
							provider,
							providerId,
							email,
							firstName,
							lastName,
							password,
							department,
							className,
							academicYear,
							degreeClassfication
						] = row
						const certification = new Certification({
							organizationName: provider as Providers,
							academicYear: academicYear as string,
							degreeClassfication:
								degreeClassfication as DegreeClassfication
						})
						const user: Partial<User> = {
							provider: provider as Providers,
							providerId: providerId as string,
							displayName: providerId as string,
							email: email as string,
							firstName: firstName as string,
							lastName: lastName as string,
							password: password as string,
							department: department as string,
							class: className as string
						}
						usersPromise.push(this.create(user, certification))
					})
				}
			)

			const users = await Promise.all(usersPromise)
			return users
		} catch (error) {
			return error
		}
	}

	public async list() {
		const users = await this.userRepository
			.createQueryBuilder('user')
			.where('user.role = :role', {
				role: Role.USER
			})
			.select([
				'user.provider',
				'user.provider_id',
				'user.email',
				'user.first_name',
				'user.last_name',
				'user.department',
				'user.class'
			])
			.execute()

		return users
	}

	public searchUsers = (args: any) => {
		const { searchQuery } = args

		return this.userRepository
			.createQueryBuilder()
			.select([
				'user.provider',
				'user.provider_id',
				'user.email',
				'user.first_name',
				'user.last_name',
				'user.department',
				'user.class'
			])
			.where('user.role = :role', {
				role: Role.USER
			})
			.andWhere('fullName ILIKE :searchQuery', {
				searchQuery: `%${searchQuery}%`
			})
			.orWhere('username ILIKE :searchQuery', {
				searchQuery: `%${searchQuery}%`
			})
			.orWhere('description ILIKE :searchQuery', {
				searchQuery: `%${searchQuery}%`
			})
			.getMany()
	}

	public async update(userId: string, values: QueryDeepPartialEntity<User>) {
		this.userRepository
			.createQueryBuilder()
			.update(User)
			.set(values)
			.where('id = :id', { id: userId })
			.execute()
	}

	public async updateProfile(
		userId: string,
		values: QueryDeepPartialEntity<User>
	) {
		try {
			await this.userRepository
				.createQueryBuilder()
				.update(User)
				.set(values)
				.where('id = :id', { id: userId })
				.execute()

			return {
				success: true,
				message: 'Profile updated'
			}
		} catch (err) {
			if (err.code == PostgresErrorCode.UniqueViolation) {
				if (err.detail.includes('email')) {
					throw new UniqueViolation('email')
				}

				if (err.detail.includes('nick_name' || 'nick' || 'nickName')) {
					throw new UniqueViolation('displayName')
				}
			}
			throw new InternalServerErrorException()
		}
	}

	public async getUserByField(field: string, value: string | number) {
		const user = await this.userRepository.findOne({
			where: { [field]: value }
		})
		return user
	}

	public async continueWithProvider(req: any) {
		let user: User

		const { providerId, email } = req.user
		user = await this.userRepository
			.createQueryBuilder()
			.where('provider_id = :providerId', { providerId })
			.orWhere('email = :email', { email })
			.getOne()

		if (user) {
			if (req.user.email === user.email && user.provider == 'local') {
				throw new BadRequestException(
					'User with email same as the social provider already exists'
				)
			}
		}

		if (!user) {
			user = this.userRepository.create({
				provider: req.user.provider,
				providerId: req.user.providerId,
				email: req.user.email,
				password: req.user.password,
				firstName: req.user.firstName,
				lastName: req.user.lastName,
				displayName: req.user.displayName,
				image: req.user.image,
				accountStatus: AccountStatus.VERIFIED
			})

			await this.userRepository.save(user)
		}

		return user
	}
}
