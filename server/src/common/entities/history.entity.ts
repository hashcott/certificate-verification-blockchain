import { Column, Entity } from 'typeorm'
import { AbstractEntity } from './'
import { Method } from 'common/enums'

@Entity()
export class History extends AbstractEntity<History> {
	@Column({
		name: 'method',
		nullable: false,
		default: Method.UPDATE,
		type: 'enum',
		enum: Method
	})
	public method: Method

	@Column()
	message: string
}
