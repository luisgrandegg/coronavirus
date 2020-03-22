import { Module } from '@nestjs/common';

import { UserModule } from '../User/user.module';
import { DoctorModule } from '../Doctor/doctor.module';
import { InquiryModule } from '../Inquiry/inquiry.module';
import { AdminController } from './admin.controller';
import { StatModule } from '../Stat/stat.module';
import { AuthModule } from '../Auth/auth.module';

@Module({
    exports: [],
    imports: [
        AuthModule,
        DoctorModule,
        InquiryModule,
        StatModule,
        UserModule
    ],
    controllers: [AdminController],
    providers: []
})
export class AdminModule {}
