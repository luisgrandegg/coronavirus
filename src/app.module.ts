import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AuthModule, Auth } from './Auth';
import { UserModule, User, UserController } from './User';
import { database } from './config';
import { Feeling, FeelingModule } from './Feeling';
import { Temperature, TemperatureModule } from './Temperature';
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
                Feeling,
                Inquiry,
                InquiryAudit,
                Temperature,
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
        FeelingModule,
        InquiryModule,
        InquiryAuditModule,
        MailModule,
        TemperatureModule,
        UserModule
    ],
    controllers: [AppController],
    providers: [],
})
export class AppModule {
    configure(consumer: MiddlewareConsumer): void {
        consumer
            .apply(IsAuthorizedMiddleware)
            .forRoutes(UserController);
        consumer
            .apply(AuthDoctorMiddleware)
            .exclude(
                { path: InquiryRoutes.CREATE, method: RequestMethod.POST },
            )
            .forRoutes(InquiryController);
        consumer
            .apply(AuthAdminMiddleware)
            .forRoutes(
                { path: UserRoutes.VALIDATE, method: RequestMethod.POST }
            )
        consumer
            .apply(AuthAdminMiddleware)
            .forRoutes(DoctorController)
    }
}
