import { Repository } from 'typeorm'

import { Certificate } from 'crypto'

export class CertificateRepository extends Repository<Certificate> {}
