import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { InquiryService } from './inquiry.service';
import { Inquiry } from './Inquiry';
import { InquiryController } from './inquiry.controller';
import { CryptoModule } from '../Crypto';
import { InquiryAuditModule } from '../InquiryAudit';

@Module({
    exports: [
        InquiryService
    ],
    imports: [
        TypeOrmModule.forFeature([Inquiry]),
        CryptoModule,
        InquiryAuditModule
    ],
    controllers: [InquiryController],
    providers: [InquiryService],
})
export class InquiryModule {}
