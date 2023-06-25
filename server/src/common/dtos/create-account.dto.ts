import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, NotContains, Length, IsEmail } from 'class-validator'
import { Position, Role } from 'common/enums'

export class CreateAccountDto {
	@ApiProperty({
		required: true,
		example: 'demo@demo.com'
	})
	@IsNotEmpty({
		message: 'Email cannot be empty or whitespace'
	})
	@IsEmail(
		{},
		{
			message: 'Email should be email'
		}
	)
	email: string

	@ApiProperty({
		required: true,
		example: 'demo123'
	})
	@IsNotEmpty({
		message: 'Password cannot be empty or whitespace'
	})
	@NotContains(' ', {
		message: 'Password cannot be empty or whitespace'
	})
	@Length(6, 100, {
		message: 'Password must be between 6 and 100 characters long'
	})
	password: string

	@ApiProperty({
		required: true,
		example: 'John'
	})
	@IsNotEmpty({
		message: 'First name cannot be empty or whitespace'
	})
	@Length(2, 30, {
		message: 'First name must be between 3 and 30 characters long'
	})
	firstName: string

	@ApiProperty({
		required: true,
		example: 'Doe'
	})
	@IsNotEmpty({
		message: 'Last name cannot be empty or whitespace'
	})
	@Length(3, 50, {
		message: 'Last name must be between 3 and 50 characters long'
	})
	lastName: string

	@ApiProperty({
		required: true,
		example: 'moderator'
	})
	@IsNotEmpty({
		message: 'Role cannot be empty or whitespace'
	})
	role: Role

	@ApiProperty({
		required: true,
		example: 'moderator'
	})
	@IsNotEmpty({
		message: 'Position cannot be empty or whitespace'
	})
	position: Position
}
