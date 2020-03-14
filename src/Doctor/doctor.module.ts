import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DoctorService } from './doctor.service';
import { Doctor } from './Doctor';
import { DoctorRepository } from './doctor.repository';
import { MailModule } from '../Mail';

@Module({
    exports: [
        DoctorService
    ],
    imports: [
        TypeOrmModule.forFeature([Doctor, DoctorRepository]),
        MailModule
    ],
    controllers: [],
    providers: [DoctorService],
})
export class DoctorModule {}
