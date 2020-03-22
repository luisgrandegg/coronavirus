import { Module } from '@nestjs/common';

import { UserModule } from '../User';
import { DoctorModule } from '../Doctor';
import { InquiryModule } from '../Inquiry';
import { AdminController } from './admin.controller';
import { StatModule } from '../Stat/stat.module';

@Module({
    exports: [],
    imports: [
        DoctorModule,
        InquiryModule,
        StatModule,
        UserModule
    ],
    controllers: [AdminController],
    providers: []
})
export class AdminModule {}
