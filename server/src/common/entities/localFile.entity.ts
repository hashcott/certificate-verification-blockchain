import { Column, Entity } from 'typeorm'
import { AbstractEntity } from './'

@Entity()
export class LocalFile extends AbstractEntity<LocalFile> {
	@Column()
	filename: string

	@Column()
	path: string

	@Column()
	mimetype: string
}
