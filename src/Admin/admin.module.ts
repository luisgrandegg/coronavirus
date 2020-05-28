import { Module } from '@nestjs/common';

import { UserModule } from '../User/user.module';
import { DoctorModule } from '../Doctor/doctor.module';
import { InquiryModule } from '../Inquiry/inquiry.module';
import { AdminController } from './admin.controller';
import { StatModule } from '../Stat/stat.module';
import { AuthModule } from '../Auth/auth.module';
import { MailModule } from '../Mail/mail.module';

@Module({
    exports: [],
    imports: [
        AuthModule,
        DoctorModule,
        InquiryModule,
        MailModule,
        StatModule,
        UserModule
    ],
    controllers: [AdminController],
    providers: []
})
export class AdminModule {}
