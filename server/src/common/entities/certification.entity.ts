import { Column, Entity } from 'typeorm'

import { AbstractEntity } from './'
import { CertificationStatus, DegreeClassification } from '../enums'

@Entity()
export class Certification extends AbstractEntity<Certification> {
	@Column({
		length: 256,
		name: 'firstName',
		nullable: false
	})
	public firstName: string

	@Column({
		length: 256,
		name: 'lastName',
		nullable: false
	})
	public lastName: string

	@Column({
		length: 256,
		name: 'studentCode',
		nullable: false
	})
	public studentCode: string

	@Column({
		length: 256,
		name: 'citizenIdentificationCode',
		nullable: false
	})
	public citizenIdentificationCode: string

	@Column({
		length: 256,
		name: 'birth',
		nullable: false
	})
	public birth: string

	@Column({
		length: 256,
		name: 'gender',
		nullable: false
	})
	public gender: string

	@Column({
		length: 256,
		name: 'academicYear',
		nullable: false
	})
	public academicYear: string

	@Column({
		name: 'degreeClassification',
		nullable: false,
		type: 'enum',
		default: DegreeClassification.Good,
		enum: DegreeClassification
	})
	public degreeClassification: DegreeClassification

	@Column({
		name: 'certification_status',
		nullable: false,
		default: CertificationStatus.PENDING,
		type: 'enum',
		enum: CertificationStatus
	})
	public certificationStatus: CertificationStatus

	@Column({
		name: 'is_verified_by_khoa',
		default: false
	})
	public isVerifiedByKHOA: boolean

	@Column({
		name: 'is_verified_by_daotao',
		default: false
	})
	public isVerifiedByDAOTAO: boolean

	@Column({
		name: 'is_verified_by_taivu',
		default: false
	})
	public isVerifiedByTAIVU: boolean

	@Column({
		name: 'is_verified_by_ht',
		default: false
	})
	public isVerifiedByHT: boolean

	@Column({
		name: 'is_verified_by_thuvien',
		default: false
	})
	public isVerifiedByTHUVIEN: boolean

	@Column({
		name: 'is_verified_by_ktx',
		default: false
	})
	public isVerifiedByKTX: boolean
}
