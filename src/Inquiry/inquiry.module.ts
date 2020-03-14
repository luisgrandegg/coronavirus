import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { InquiryService } from './inquiry.service';
import { Inquiry } from './Inquiry';
import { InquiryController } from './inquiry.controller';

@Module({
    exports: [
        InquiryService
    ],
    imports: [
        TypeOrmModule.forFeature([Inquiry]),
    ],
    controllers: [InquiryController],
    providers: [InquiryService],
})
export class InquiryModule {}
