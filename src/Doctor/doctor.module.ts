import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DoctorService } from './doctor.service';
import { Doctor } from './Doctor';
import { DoctorRepository } from './doctor.repository';
import { DoctorController } from './doctor.controller';
import { UserModule } from '../User';

@Module({
    exports: [
        DoctorService
    ],
    imports: [
        TypeOrmModule.forFeature([Doctor, DoctorRepository]),
        UserModule
    ],
    controllers: [DoctorController],
    providers: [DoctorService],
})
export class DoctorModule {}
