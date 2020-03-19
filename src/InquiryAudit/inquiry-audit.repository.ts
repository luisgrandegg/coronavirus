import { EntityRepository } from 'typeorm';

import { Repository } from '../Repository';

import { InquiryAudit } from './InquiryAudit';

@EntityRepository(InquiryAudit)
export class InquiryAuditRepository extends Repository<InquiryAudit> {}
