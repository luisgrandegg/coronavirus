import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Doctor } from './Doctor';
import { DoctorRepository } from './doctor.repository';
import { IAuth } from '../Auth';
import { RegisterDoctorDto } from '../dto/RegisterDoctorDto';
import { MailService } from '../Mail';
import { DoctorMail } from './DoctorMail';
import { DoctorListParams } from '../dto/DoctorListParams';
import { UserService, User } from '../User';
import { UserListParams } from 'src/dto/UserListParams';
import { ObjectId } from 'mongodb';

@Injectable()
export class DoctorService {
    constructor(
        @InjectRepository(DoctorRepository)
        private doctorRepository: DoctorRepository,
        private mailService: MailService,
        private userService: UserService
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

    async findByIds(doctorIds: ObjectId[]): Promise<Doctor[]> {
        return this.doctorRepository.find({
            where: {
                $or: doctorIds.map((id: ObjectId) =>({
                    userId: id
                }))
            }
        });
    }

    async get(doctorListParams: DoctorListParams): Promise<Doctor[]> {
        if (doctorListParams.isValidated === true || doctorListParams.isValidated === false) {
            return this.userService.get(new UserListParams(doctorListParams.isValidated))
                .then((users: User[]) => this.findByIds(users.map((user: User) => user.id)));
        }
        return this.doctorRepository.find({
            where: { ...doctorListParams.toJSON() },
            order: {
                createdAt: 1
            }
        });
    }
}
