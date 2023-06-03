import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Certification, User } from '../../../common/entities'
import { Repository } from 'typeorm'
import { CertificationStatus, Position } from 'common/enums'

@Injectable()
export class CertificationService {
	constructor(
		@InjectRepository(Certification)
		private readonly certificationRepository: Repository<Certification>,
		@InjectRepository(User)
		private readonly userRepository: Repository<User>
	) {}

	public async getCertification(id: string) {
		return []
	}

	public async listCerts() {
		const certs = await this.certificationRepository.find()
		return certs
	}

	public async confirm(idUser: string, providerId: string) {
		const mod = await this.userRepository.findOne({
			where: {
				id: idUser
			}
		})

		if (!mod) {
			throw new Error('User managemnet not found')
		}

		const user = await this.userRepository.findOne({
			where: {
				providerId: providerId
			},
			relations: {
				certification: true
			}
		})

		if (
			user.certification.certificationStatus ===
			CertificationStatus.VERIFIED
		) {
			throw new Error('Saved to blockchain, cannt modifier')
		}

		if (!user) {
			throw new Error('User not found')
		}

		const cert = await this.certificationRepository.save({
			...user.certification,
			[`isVerifiedBy${mod.position}`]: true
		})
		let isCheck = false
		if (
			cert[`isVerifiedBy${Position.DAOTAO}`] &&
			cert[`isVerifiedBy${Position.HT}`] &&
			cert[`isVerifiedBy${Position.KHOA}`] &&
			cert[`isVerifiedBy${Position.KTX}`] &&
			cert[`isVerifiedBy${Position.TAIVU}`] &&
			cert[`isVerifiedBy${Position.THUVIEN}`]
		) {
			await this.certificationRepository.save({
				...cert,
				certificationStatus: CertificationStatus.VERIFIED
			})
			isCheck = true
		}
		return { isCheck }
	}

	public async unconfirm(idUser: string, providerId: string) {
		const mod = await this.userRepository.findOne({
			where: {
				id: idUser
			}
		})

		if (!mod) {
			throw new Error('User managemnet not found')
		}

		const user = await this.userRepository.findOne({
			where: {
				providerId: providerId
			},
			relations: {
				certification: true
			}
		})

		if (!user) {
			throw new Error('User not found')
		}

		await this.certificationRepository.save({
			...user.certification,
			[`isVerifiedBy${mod.position}`]: true
		})
		return true
	}
}
