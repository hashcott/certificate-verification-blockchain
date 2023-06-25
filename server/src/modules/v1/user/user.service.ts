import {
	BadRequestException,
	Injectable,
	InternalServerErrorException
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'

import { User } from '../../../common/entities'
import { AccountStatus, PostgresErrorCode, Role } from '../../../common/enums'
import { UniqueViolation } from '../../../common/exceptions'
import { Repository } from 'typeorm'

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>
	) {}

	public async create(data: Partial<User>) {
		const user = this.userRepository.create(data)
		await this.userRepository.save(user)
		return user
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
				image: req.user.image,
				accountStatus: AccountStatus.VERIFIED
			})

			await this.userRepository.save(user)
		}

		return user
	}
}
