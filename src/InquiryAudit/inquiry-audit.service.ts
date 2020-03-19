import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { InquiryAuditRepository } from './inquiry-audit.repository';
import { InquiryAudit, InquiryAuditAction } from './InquiryAudit';
import { Inquiry } from '../Inquiry';
import { ObjectId } from 'mongodb';

@Injectable()
export class InquiryAuditService {
    constructor(
        @InjectRepository(InquiryAudit)
        private inquiryAuditRepository: InquiryAuditRepository
    ) {}

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
