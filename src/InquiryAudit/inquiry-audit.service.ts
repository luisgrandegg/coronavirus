import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { InquiryAuditRepository } from './inquiry-audit.repository';
import { InquiryAudit, InquiryAuditAction } from './InquiryAudit';
import { Inquiry } from '../Inquiry';
import { ObjectId } from 'mongodb';
import { InquiryAuditWorker } from './inquiry-audit.worker';

@Injectable()
export class InquiryAuditService {
    constructor(
        @InjectRepository(InquiryAudit)
        private inquiryAuditRepository: InquiryAuditRepository
    ) {
        new InquiryAuditWorker(this);
    }

    async create(
        inquiry: Inquiry,
        inquiryAuditAction: InquiryAuditAction,
        userId?: ObjectId
    ): Promise<InquiryAudit> {
        const inquiryAudit = this.inquiryAuditRepository.create();
        inquiryAudit.action = inquiryAuditAction;
        inquiryAudit.inquiryId = inquiry.id;
        inquiryAudit.userId = userId;
        return this.inquiryAuditRepository.save(inquiryAudit);
    }
}
