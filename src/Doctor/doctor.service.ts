import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Doctor } from './Doctor';
import { DoctorRepository } from './doctor.repository';
import { IAuth } from '../Auth';
import { RegisterDoctorDto } from '../dto/RegisterDoctorDto';
import { MailService } from '../Mail';
import { DoctorMail } from './DoctorMail';

@Injectable()
export class DoctorService {
    constructor(
        @InjectRepository(DoctorRepository)
        private doctorRepository: DoctorRepository,
        private mailService: MailService
    ) {}

    async create(registerDoctorDto: RegisterDoctorDto, auth: Pick<IAuth, 'userId'>): Promise<Doctor> {
        const doctor = this.doctorRepository.create();
        doctor.name = registerDoctorDto.name;
        doctor.surname = registerDoctorDto.surname;
        doctor.speciality = registerDoctorDto.speciality;
        doctor.license = registerDoctorDto.license;
        doctor.email = registerDoctorDto.email;
        doctor.phone = registerDoctorDto.phone;
        doctor.userId = auth.userId;
        return this.doctorRepository.save(doctor)
            .then(async (savedDoctor: Doctor) => {
                return this.mailService.send(DoctorMail.ceateFromDoctor(savedDoctor))
                    .then(() => savedDoctor);
            });
    }
}
