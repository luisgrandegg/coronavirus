import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DoctorService } from './doctor.service';
import { Doctor } from './Doctor';
import { DoctorRepository } from './doctor.repository';
import { MailModule } from '../Mail';
import { DoctorController } from './doctor.controller';
import { UserModule } from 'src/User';

@Module({
    exports: [
        DoctorService
    ],
    imports: [
        TypeOrmModule.forFeature([Doctor, DoctorRepository]),
        MailModule,
        UserModule
    ],
    controllers: [DoctorController],
    providers: [DoctorService],
})
export class DoctorModule {}
