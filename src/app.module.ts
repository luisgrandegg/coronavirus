import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { Auth } from './Auth';
import { AuthModule } from './Auth/auth.module';
import { User } from './User';
import { UserModule } from './User/user.module';
import { UserController } from './User/user.controller';
import { database } from './config';
import { Doctor } from './Doctor';
import { DoctorModule } from './Doctor/doctor.module';
import { Inquiry } from './Inquiry';
import { InquiryModule } from './Inquiry/inquiry.module';
import { Routes as InquiryRoutes } from './Inquiry/inquiry.controller';
import { Routes as GratitudeRoutes } from './Gratitude/gratitude.controller';
import { AuthDoctorMiddleware } from './Auth/AuthDoctorMiddleware';
import { MailModule } from './Mail/mail.module';
import { AuthAdminMiddleware } from './Auth/AuthAdminMiddleware';
import { DoctorController } from './Doctor/doctor.controller';
import { CryptoModule } from './Crypto/crypto.module';
import { InquiryAudit } from './InquiryAudit';
import { InquiryAuditModule } from './InquiryAudit/inquiry-audit.module'
import { StatModule } from './Stat/stat.module';
import { AdminController } from './Admin/admin.controller';
import { AdminModule } from './Admin/admin.module';
import { Stat } from './Stat';
import { GratitudeModule } from './Gratitude/gratitude.module';
import { Gratitude } from './Gratitude';
import { MediaModule } from './Media/media.module';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            entities: [
                Auth,
                Doctor,
                Gratitude,
                Inquiry,
                InquiryAudit,
                Stat,
                User
            ],
            logging: false,
            synchronize: false,
            type: 'mongodb',
            url: database.url
        }),
        AdminModule,
        AuthModule,
        CryptoModule,
        DoctorModule,
        GratitudeModule,
        InquiryModule,
        InquiryAuditModule,
        MailModule,
        MediaModule,
        StatModule,
        UserModule
    ],
    controllers: [AppController],
    providers: [],
})
export class AppModule {
    configure(consumer: MiddlewareConsumer): void {
        consumer
            .apply(AuthDoctorMiddleware)
            .forRoutes(
                { path: InquiryRoutes.GET, method: RequestMethod.GET },
                { path: InquiryRoutes.GET_ONE, method: RequestMethod.GET },
                { path: InquiryRoutes.ATTEND, method: RequestMethod.POST },
                { path: InquiryRoutes.UNATTEND, method: RequestMethod.POST },
                { path: InquiryRoutes.FLAG, method: RequestMethod.POST },
                { path: InquiryRoutes.UPDATE_SPECIALITY, method: RequestMethod.POST }
            );
        consumer
            .apply(AuthAdminMiddleware)
            .forRoutes(
                { path: InquiryRoutes.UNFLAG, method: RequestMethod.POST },
                { path: InquiryRoutes.SOLVE, method: RequestMethod.POST },
                { path: InquiryRoutes.ACTIVATE, method: RequestMethod.POST },
                { path: InquiryRoutes.DEACTIVATE, method: RequestMethod.POST }
            );
        consumer
            .apply(AuthAdminMiddleware)
            .forRoutes(UserController)
        consumer
            .apply(AuthAdminMiddleware)
            .forRoutes(DoctorController)
        consumer
            .apply(AuthAdminMiddleware)
            .forRoutes(AdminController)
        consumer
            .apply(AuthAdminMiddleware)
            .forRoutes(
                { path: GratitudeRoutes.UNFLAG, method: RequestMethod.POST },
                { path: GratitudeRoutes.FLAG, method: RequestMethod.POST },
                { path: GratitudeRoutes.ACTIVATE, method: RequestMethod.POST },
                { path: GratitudeRoutes.DEACTIVATE, method: RequestMethod.POST }
            );
    }
}
