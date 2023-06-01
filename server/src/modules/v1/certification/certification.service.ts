import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Certification, User } from '../../../common/entities'
import { Repository } from 'typeorm'
import { CertificationStatus } from 'common/enums'

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

	public async confirm(idUser: string, idCert: string) {
		const user = await this.userRepository.findOne({
			where: {
				id: idUser
			}
		})

		if (!user) {
			throw new Error('User not found')
		}

		const cert = await this.certificationRepository.findOne({
			where: {
				id: idCert
			}
		})

		cert[`isVerifiedBy${user.position}`] = true

		return true
	}

	public async listCerts() {
		const certs = await this.certificationRepository.find()
		return certs
	}

	public async unconfirm(idUser: string, idCert: string) {
		const user = await this.userRepository.findOne({
			where: {
				id: idUser
			}
		})

		if (!user) {
			throw new Error('User not found')
		}

		const cert = await this.certificationRepository.findOne({
			where: {
				id: idCert
			}
		})
		if (cert.certificationStatus === CertificationStatus.VERIFIED) {
			throw new Error('Certification saved into blockchain')
		}

		cert[`isVerifiedBy${user.position}`] = true

		return true
	}
}
