import { Repository } from 'typeorm'
import { User } from '../../../../common/entities'

export class UserRepository extends Repository<User> {}
