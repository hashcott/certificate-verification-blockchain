import { Exclude } from 'class-transformer'
import {
	BeforeInsert,
	Column,
	Entity,
	Index,
	ManyToMany,
	OneToMany,
	OneToOne
} from 'typeorm'

import { AbstractEntity, User } from '../../../common/entities'
import { Providers, CertificationStatus } from '../../../common/enums'

@Entity()
export class Certification extends AbstractEntity<Certification> {
	@Column({
		name: 'provider',
		nullable: true,
		type: 'enum',
		enum: Providers
	})
	public provider: Providers

	@Index()
	@Column({
		length: 200,
		name: 'provider_id',
		nullable: true
	})
	public providerId: string

	@Index()
	@Column({
		unique: true,
		length: 200,
		name: 'name',
		nullable: false
	})
	public email: string

	@Column({
		length: 200,
		name: 'first_name',
		nullable: false
	})
	public firstName: string

	@Column({
		length: 200,
		name: 'last_name',
		nullable: false
	})
	public lastName: string

	@Column({
		name: 'certification_status',
		nullable: false,
		default: CertificationStatus.PENDING,
		type: 'enum',
		enum: CertificationStatus
	})
	public CertificationStatus: CertificationStatus

	@OneToOne(() => User, (user) => user)
	public user: User
}
