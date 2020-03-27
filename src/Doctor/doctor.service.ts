import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Doctor } from './Doctor';
import { DoctorRepository } from './doctor.repository';
import { IAuth } from '../Auth/Auth';
import { RegisterDoctorDto } from '../dto/RegisterDoctorDto';
import { DoctorListParams } from '../dto/DoctorListParams';
import { User } from '../User';
import { UserService } from '../User/user.service';
import { UserListParams } from '../dto/UserListParams';
import { ObjectId } from 'mongodb';
import { DoctorWorker } from './doctor.worker';
import { DoctorCommentDto } from '../dto/DoctorCommentDto';

@Injectable()
export class DoctorService {
    constructor(
        @InjectRepository(DoctorRepository)
        private doctorRepository: DoctorRepository,
        private userService: UserService
    ) {
        new DoctorWorker(this);
    }

    async create(registerDoctorDto: RegisterDoctorDto, auth: Pick<IAuth, 'userId'>): Promise<Doctor> {
        const doctor = this.doctorRepository.create();
        doctor.name = registerDoctorDto.name;
        doctor.surname = registerDoctorDto.surname;
        doctor.speciality = registerDoctorDto.speciality;
        doctor.license = registerDoctorDto.license;
        doctor.email = registerDoctorDto.email;
        doctor.phone = registerDoctorDto.phone;
        doctor.userId = auth.userId;
        doctor.doctorType = registerDoctorDto.doctorType;

        return this.doctorRepository.save(doctor);
    }

    async comment(doctorId: string, doctorCommentDto: DoctorCommentDto): Promise<Doctor> {
        return this.doctorRepository.findOne(doctorId)
            .then((doctor: Doctor) => {
                doctor.comment = doctorCommentDto.comment;
                return this.doctorRepository.save(doctor);
            })
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

    async findByUserId(userId: ObjectId): Promise<Doctor> {
        return this.doctorRepository.findByUserId(userId);
    }

    async get(doctorListParams?: DoctorListParams): Promise<Doctor[]> {
        if (!doctorListParams) {
            return this.doctorRepository.find({
                order: {
                    createdAt: 1
                }
            });
        }
        if (
            doctorListParams.isActive === true || doctorListParams.isActive === false,
            doctorListParams.isValidated === true || doctorListParams.isValidated === false
        ) {
            return this.userService.get(
                new UserListParams(doctorListParams.isActive, doctorListParams.isValidated, doctorListParams.doctorType)
            )
                .then((users: User[]) => this.findByIds(users.map((user: User) => user.id)))
                .catch(() => []);
        }
        return this.doctorRepository.find({
            where: { ...doctorListParams.toJSON() },
            order: {
                createdAt: 1
            }
        });
    }

    async attendInquiry(userId: ObjectId): Promise<Doctor> {
        return this.findByUserId(userId)
            .then((doctor: Doctor) => {
                if (!doctor.inquiriesAttended) {
                    doctor.inquiriesAttended = 0;
                }
                doctor.inquiriesAttended++;
                return this.doctorRepository.save(doctor);
            })
    }

    async unattendInquiry(userId: ObjectId): Promise<Doctor> {
        return this.findByUserId(userId)
            .then((doctor: Doctor) => {
                if (!doctor.inquiriesAttended) {
                    doctor.inquiriesAttended = 1;
                }
                doctor.inquiriesAttended--;
                return this.doctorRepository.save(doctor);
            })
    }

    async save(doctor: Doctor): Promise<Doctor> {
        return this.doctorRepository.save(doctor);
    }
}
