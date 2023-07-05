import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Certification, User } from '../../../common/entities'
import { Repository, Like, Equal } from 'typeorm'
import { CertificationStatus, Position } from 'common/enums'
import { InjectQueue } from '@nestjs/bull'
import { Queue } from 'bull'

import { DegreeClassification } from '../../../common/enums'
import { LocalFileDto } from 'common/dtos/localFile.dto'
import { join } from 'path'
import readXlsxFile from 'read-excel-file/node'
import { LocalFilesService } from './localFiles.service'
import { CertificationDto } from 'common/dtos'
import { take } from 'rxjs'

@Injectable()
export class CertificationService {
	constructor(
		@InjectRepository(Certification)
		private readonly certificationRepository: Repository<Certification>,
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		private localFilesService: LocalFilesService,
		@InjectQueue('cert') private addCertQueue: Queue
	) {}

	public async listCerts() {
		const certs = await this.certificationRepository.find()
		return certs
	}

	public async create(certDto: CertificationDto) {
		try {
			const cert = await this.certificationRepository.save(certDto)
			return cert
		} catch (error) {
			throw new Error('Cannt save ' + certDto.studentCode)
		}
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

		const cert = await this.certificationRepository.findOne({
			where: {
				studentCode: providerId
			}
		})
		if (cert) {
			if (cert.certificationStatus === CertificationStatus.VERIFIED) {
				throw new Error('Saved to blockchain, cannt modifier')
			}

			let updateCert = await this.certificationRepository.save({
				...cert,
				[`isVerifiedBy${mod.position}`]: true
			})
			if (
				updateCert[`isVerifiedBy${Position.DAOTAO}`] &&
				updateCert[`isVerifiedBy${Position.HT}`] &&
				updateCert[`isVerifiedBy${Position.KHOA}`] &&
				updateCert[`isVerifiedBy${Position.KTX}`] &&
				updateCert[`isVerifiedBy${Position.TAIVU}`] &&
				updateCert[`isVerifiedBy${Position.THUVIEN}`]
			) {
				updateCert = await this.certificationRepository.save({
					...cert,
					certificationStatus: CertificationStatus.VERIFIED
				})

				await this.addCertQueue.add({
					...updateCert
				})
			}
			return updateCert
		}
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

		const cert = await this.certificationRepository.findOne({
			where: {
				studentCode: providerId
			}
		})
		if (cert) {
			if (cert.certificationStatus === CertificationStatus.VERIFIED) {
				throw new Error('Saved to blockchain, cannt modifier')
			}
			await this.certificationRepository.save({
				...cert,
				[`isVerifiedBy${mod.position}`]: false
			})
			return cert
		}
		return null
	}

	public async saveCerts(fileData: LocalFileDto) {
		await this.localFilesService.saveLocalFileData(fileData)
		const certPromise: Promise<CertificationDto>[] = []
		try {
			await readXlsxFile(join(process.cwd(), fileData.path)).then(
				(rows) => {
					rows.shift()
					rows.forEach((row) => {
						const [
							firstName,
							lastName,
							studentCode,
							citizenIdentificationCode,
							birth,
							gender,
							degreeClassification,
							academicYear
						] = row
						const certification = {
							firstName: firstName as string,
							lastName: lastName as string,
							studentCode: studentCode as string,
							citizenIdentificationCode:
								citizenIdentificationCode as string,
							birth: birth as string,
							gender: gender as string,
							degreeClassification:
								degreeClassification as DegreeClassification,
							academicYear: academicYear as string
						} as CertificationDto

						certPromise.push(this.create(certification))
					})
				}
			)

			const users = await Promise.all(certPromise)
			return users
		} catch (error) {
			throw error
		}
	}

	public async list() {
		const certs = await this.certificationRepository.find()
		return certs
	}

	public async search(searchQuery: string) {
		const cert = await this.certificationRepository.find({
			where: {
				citizenIdentificationCode: Like(`%${searchQuery}%`),
				studentCode: Like(`%${searchQuery}%`),
				firstName: Like(`%${searchQuery}%`),
				lastName: Like(`%${searchQuery}%`),
				certificationStatus: CertificationStatus.VERIFIED
			},
			take: 5
		})
		return cert
	}

	public async getOne(id: string) {
		const cert = await this.certificationRepository.findOne({
			where: {
				studentCode: id,
				certificationStatus: CertificationStatus.VERIFIED
			}
		})
		console.log(cert)

		return cert
	}
}
