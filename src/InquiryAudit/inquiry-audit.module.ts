import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { InquiryAuditService } from './inquiry-audit.service';
import { InquiryAudit } from './InquiryAudit';

@Module({
    exports: [
        InquiryAuditService
    ],
    imports: [
        TypeOrmModule.forFeature([InquiryAudit]),
    ],
    controllers: [],
    providers: [InquiryAuditService],
})
export class InquiryAuditModule {}
