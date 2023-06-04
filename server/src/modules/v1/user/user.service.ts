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
import { Like, Repository } from 'typeorm'
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
		const user = this.userRepository.create(data)
		if (!data.providerId) {
			user.providerId = user.id
		}
		if (cert) {
			user.certification = cert
		}
		await this.userRepository.save(user)
		return user
	}
	public async saveUsers(fileData: LocalFileDto) {
		await this.localFilesService.saveLocalFileData(fileData)
		const usersPromise: Promise<User>[] = []
		try {
			await readXlsxFile(join(process.cwd(), fileData.path)).then(
				(rows) => {
					rows.shift()
					rows.forEach((row) => {
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
			throw error
		}
	}

	public async list() {
		const users = await this.userRepository.find({
			where: {
				role: Role.USER
			},
			relations: {
				certification: true
			},
			select: [
				'providerId',
				'email',
				'firstName',
				'lastName',
				'department',
				'class',
				'certification'
			]
		})

		return users
	}

	public async listManager() {
		const users = await this.userRepository.find({
			where: {
				role: Role.MODERATOR
			},
			select: ['id', 'email', 'firstName', 'lastName', 'role', 'position']
		})

		return users
	}

	public async searchUsers(searchQuery: string) {
		const user = await this.userRepository.find({
			where: [
				{ role: Role.USER, providerId: Like(`%${searchQuery}%`) },
				{ role: Role.USER, email: Like(`%${searchQuery}%`) },
				{ role: Role.USER, firstName: Like(`%${searchQuery}%`) },
				{ role: Role.USER, lastName: Like(`%${searchQuery}%`) }
			],
			relations: {
				certification: true
			},
			take: 5
		})
		return user
	}

	public async getOne(id: string) {
		const user = await this.userRepository.findOne({
			where: [{ role: Role.USER, providerId: id }],
			relations: {
				certification: true
			}
		})
		return user
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
