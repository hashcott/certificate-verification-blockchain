import { Controller, Get } from '@nestjs/common'

@Controller()
export class MainController {
	@Get()
	getInfo(): string {
		return 'Developed by Harry Nguyen'
	}
}
