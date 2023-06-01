import { Column, Entity, OneToMany, OneToOne } from 'typeorm'

import { AbstractEntity, User } from './'
import { CertificationStatus, DegreeClassfication } from '../enums'

@Entity()
export class Certification extends AbstractEntity<Certification> {
	@Column({
		name: 'organization_name',
		nullable: false,
		length: 256
	})
	public organizationName: string

	@Column({
		length: 256,
		name: 'academic_year',
		nullable: false
	})
	public academicYear: string

	@Column({
		name: 'degree_classfication',
		nullable: false,
		type: 'enum',
		default: DegreeClassfication.GOOD,
		enum: DegreeClassfication
	})
	public degreeClassfication: DegreeClassfication

	@Column({
		name: 'certification_status',
		nullable: false,
		default: CertificationStatus.PENDING,
		type: 'enum',
		enum: CertificationStatus
	})
	public certificationStatus: CertificationStatus

	@OneToOne(() => User, (user) => user.certification, { cascade: ['insert'] })
	public user: User

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
