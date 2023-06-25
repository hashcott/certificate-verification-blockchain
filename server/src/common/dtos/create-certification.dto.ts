import { DegreeClassification } from 'common/enums'

export interface CertificationDto {
	certificateId: string
	firstName: string
	lastName: string
	studentCode: string
	citizenIdentificationCode: string
	birth: string
	gender: string
	degreeClassification: DegreeClassification
	academicYear: string
}
