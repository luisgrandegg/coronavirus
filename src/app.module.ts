import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AuthModule, Auth } from './Auth';
import { UserModule, User, UserController } from './User';
import { database } from './config';
import { IsAuthorizedMiddleware } from './Auth/AuthMiddleware';
import { DoctorModule, Doctor } from './Doctor';
import { InquiryModule, Inquiry } from './Inquiry';
import { InquiryController, Routes as InquiryRoutes } from './Inquiry/inquiry.controller';
import { AuthDoctorMiddleware } from './Auth/AuthDoctorMiddleware';
import { MailModule } from './Mail';
import { AuthAdminMiddleware } from './Auth/AuthAdminMiddleware';
import { Routes as UserRoutes } from './User/user.controller';
import { Routes as DoctorRoutes, DoctorController } from './Doctor/doctor.controller';
import { CryptoModule } from './Crypto';
import { InquiryAuditModule, InquiryAudit } from './InquiryAudit';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            entities: [
                Auth,
                Doctor,
                Inquiry,
                InquiryAudit,
                User
            ],
            logging: false,
            synchronize: false,
            type: 'mongodb',
            url: database.url
        }),
        AuthModule,
        CryptoModule,
        DoctorModule,
        InquiryModule,
        InquiryAuditModule,
        MailModule,
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
                { path: InquiryRoutes.FLAG, method: RequestMethod.POST }
            );
        consumer
            .apply(AuthAdminMiddleware)
            .forRoutes(
                { path: InquiryRoutes.UNFLAG, method: RequestMethod.POST },
                { path: InquiryRoutes.SOLVE, method: RequestMethod.POST },
                { path: InquiryRoutes.ACTIVATE, method: RequestMethod.POST },
                { path: InquiryRoutes.DEACTIVATE, method: RequestMethod.POST },
                { path: InquiryRoutes.MIGRATE, method: RequestMethod.POST }

            );
        consumer
            .apply(AuthAdminMiddleware)
            .forRoutes(UserController)
        consumer
            .apply(AuthAdminMiddleware)
            .forRoutes(DoctorController)
    }
}
