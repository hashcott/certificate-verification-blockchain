import { User } from '../../src/common/entities'
import { Providers } from '../../src/common/enums'

export const LocalUser: Partial<User> = {
	provider: Providers.Local,
	providerId: null,
	email: 'test@email.com',
	firstName: 'Witek',
	lastName: 'Wojtyła',
	password: 'keyboardcat'
}

export const FacebookUser: Partial<User> = {
	providerId: '78247816745184',
	email: 'test2@email.com',
	firstName: 'Wojtek',
	lastName: 'Kojtyła',
	password: 'secretword'
}

export const GoogleUser: Partial<User> = {
	providerId: '134712471265132',
	email: 'test3@email.com',
	firstName: 'Varian',
	lastName: 'Wrynn',
	password: 'anduin'
}

export const NewUser: Partial<User> = {
	provider: Providers.Local,
	providerId: null,
	email: 'test4@email.com',
	firstName: 'Adam',
	lastName: 'Koryncki',
	password: 'hamslomamslo'
}

export const mockLocalUser = {
	email: LocalUser.email,
	password: LocalUser.password,
	firstName: LocalUser.firstName,
	lastName: LocalUser.lastName
}

export const testUsers: Array<Partial<User>> = [
	LocalUser,
	FacebookUser,
	GoogleUser
]
