import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as PubSub from 'pubsub-js';

import { DoctorType } from '../Doctor/Doctor';
import { Inquiry } from './Inquiry';
import { CreateInquiryDto } from '../dto/CreateInquiryDto';
import { InquiryListParams } from '../dto/InquiryListParams';
import { InquiryRepository } from './inquiry.repository';
import { ObjectId } from 'mongodb';
import { CryptoService } from '../Crypto/crypto.service';
import { InquiryDoesntExistsError } from './InquiryDoesntExistsError';
import { InquiryEvents } from './InquiryEvents';
import { FindManyOptions } from 'typeorm';

export interface IInquiriesPaginated {
    inquiries: Inquiry[];
    total: number;
}
import { Auth } from '../Auth/Auth';
import { AuthError } from '../Auth/AuthError';
import { InquiryWorker } from './InquiryWorker';

@Injectable()
export class InquiryService {
    constructor(
        @InjectRepository(Inquiry)
        private inquiryRepository: InquiryRepository,
        private cryptoService: CryptoService
    ) {
        new InquiryWorker(this);
    }

    async save(inquiry: Inquiry): Promise<Inquiry> {
        return this.inquiryRepository.save(inquiry);
    }

    async create(inquiryDto: CreateInquiryDto): Promise<Inquiry> {
        const inquiry = this.inquiryRepository.create();
        inquiry.age = inquiryDto.age;
        inquiry.email = this.cryptoService.encrypt(inquiryDto.email);
        inquiry.speciality = inquiryDto.speciality;
        inquiry.summary = this.cryptoService.encrypt(inquiryDto.summary);
        inquiry.terms = inquiryDto.terms;
        inquiry.time = this.cryptoService.encrypt(inquiryDto.time);
        inquiry.gender = inquiryDto.gender && this.cryptoService.encrypt(inquiryDto.gender);
        inquiry.genderNonBinary = inquiryDto.genderNonBinary && this.cryptoService.encrypt(inquiryDto.genderNonBinary);
        inquiry.privacy = inquiryDto.privacy;
        inquiry.confirmAge = inquiryDto.confirmAge;
        inquiry.doctorType = inquiryDto.doctorType;
        inquiry.ipAddress = inquiryDto.ipAddress;

        return this.inquiryRepository.save(inquiry)
            .then((inquiry: Inquiry) => {
                PubSub.publish(InquiryEvents.INQUIRY_CREATED, { inquiry });
                return inquiry;
            });
    }

    async get(inquiryListParams?: InquiryListParams, decrypt: boolean = true): Promise<IInquiriesPaginated> {
        const query: FindManyOptions<Inquiry> = inquiryListParams ?
            {
                where: { ...inquiryListParams.toJSON() },
                order: {
                    createdAt: 1
                },
                skip: (inquiryListParams.page - 1) * inquiryListParams.perPage,
                take: inquiryListParams.perPage
            } :
            {};
        return this.inquiryRepository.findAndCount(query).then((value: [Inquiry[], number]): IInquiriesPaginated => {
            let [inquiries, total] = value;
            inquiries = inquiries.map((inquiry: Inquiry): Inquiry => decrypt ? this.decryptInquiry(inquiry): inquiry)

            return {
                inquiries,
                total
            }
        })
    }

    async getById(id: string, auth: Auth): Promise<Inquiry> {
        const { doctorType } = auth;

        return this.inquiryRepository.findOne(id)
            .then((inquiry: Inquiry) => {
                if (!inquiry) {
                    throw new InquiryDoesntExistsError();
                }
                if (!auth.isAdmin() && doctorType !== inquiry.doctorType) {
                    throw new AuthError();
                }

                return this.decryptInquiry(inquiry);
            });
    }

    async attend(id: string, auth: Auth): Promise<Inquiry> {
        const { doctorType, userId } = auth;

        return this.inquiryRepository.findOne(id)
            .then((inquiry: Inquiry) => {
                if (!auth.isAdmin() && doctorType !== inquiry.doctorType) {
                    throw new AuthError();
                }
                inquiry.attended = true;
                inquiry.doctorId = userId;
                return this.inquiryRepository.save(inquiry)
            })
            .then((inquiry: Inquiry) => {
                PubSub.publish(InquiryEvents.INQUIRY_ATTENDED, { inquiry, userId });
                return inquiry;
            });
    }

    async unattend(id: string, auth: Auth): Promise<Inquiry> {
        const { doctorType, userId } = auth;

        return this.inquiryRepository.findOne(id)
            .then((inquiry: Inquiry) => {
                if (!auth.isAdmin() && doctorType !== inquiry.doctorType) {
                    throw new AuthError();
                }
                inquiry.attended = false;
                delete inquiry.doctorId;
                return this.inquiryRepository.save(inquiry)
            })
            .then((inquiry: Inquiry) => {
                PubSub.publish(InquiryEvents.INQUIRY_UNATTENDED, { inquiry, userId });
                return inquiry;
            });
    }

    async solve(id: string, doctorId: string): Promise<Inquiry> {
        return this.inquiryRepository.findOne(id)
            .then((inquiry: Inquiry) => {
                if (doctorId === inquiry.doctorId.toHexString()) {
                    inquiry.solved = true;
                }
                return this.inquiryRepository.save(inquiry)
            });
    }

    async flag(id: string, userId: ObjectId): Promise<Inquiry> {
        return this.inquiryRepository.findOne(id)
            .then((inquiry: Inquiry) => {
                inquiry.flagged = true;
                return this.inquiryRepository.save(inquiry)
            })
            .then((inquiry: Inquiry) => {
                PubSub.publish(InquiryEvents.INQUIRY_FLAGGED, { inquiry, userId });
                return inquiry;
            });
    }

    async unflag(id: string, userId: ObjectId): Promise<Inquiry> {
        return this.inquiryRepository.findOne(id)
            .then((inquiry: Inquiry) => {
                inquiry.flagged = false;
                return this.inquiryRepository.save(inquiry)
            })
            .then((inquiry: Inquiry) => {
                PubSub.publish(InquiryEvents.INQUIRY_UNFLAGGED, { inquiry, userId });
                return inquiry;
            });
    }

    async activate(id: string, userId: ObjectId): Promise<Inquiry> {
        return this.inquiryRepository.findOne(id)
            .then((inquiry: Inquiry) => {
                inquiry.active = true;
                return this.inquiryRepository.save(inquiry)
            })
            .then((inquiry: Inquiry) => {
                PubSub.publish(InquiryEvents.INQUIRY_ACTIVATED, { inquiry, userId });
                return inquiry;
            });
    }

    async deactivate(id: string, userId: ObjectId): Promise<Inquiry> {
        return this.inquiryRepository.findOne(id)
            .then((inquiry: Inquiry) => {
                inquiry.active = false;
                return this.inquiryRepository.save(inquiry)
            })
            .then((inquiry: Inquiry) => {
                PubSub.publish(InquiryEvents.INQUIRY_DEACTIVATED, { inquiry, userId });
                return inquiry;
            });
    }

    async updateDoctorType(id: string, doctorType: DoctorType, auth: Auth): Promise<Inquiry> {
        const { userId } = auth;

        return this.inquiryRepository.findOne(id)
            .then((inquiry: Inquiry) => {
                const originalDoctorType = inquiry.doctorType;
                inquiry.doctorType = doctorType;
                return this.inquiryRepository.save(inquiry)
                    .then((inquiry: Inquiry) => {
                        PubSub.publish(InquiryEvents.INQUIRY_CHANGE_DOCTOR_TYPE, { inquiry, userId, data: { from: originalDoctorType, to: doctorType } });
                        return inquiry;
                    })
            });
    }

    async updateSpeciality(id: string, speciality: string, auth: Auth): Promise<Inquiry> {
        return this.inquiryRepository.findOne(id)
            .then(async (inquiry: Inquiry) => {
                const originalSpeciality = inquiry.speciality;
                inquiry.speciality = speciality;
                return this.inquiryRepository.save(inquiry)
                    .then((inquiry: Inquiry) => {
                        PubSub.publish(
                            InquiryEvents.INQUIRY_CHANGE_SPECIALITY,
                            { inquiry, userId: auth.userId, data: {from: originalSpeciality, to: speciality} }
                        );
                        return inquiry;
                    })
                    .then((inquiry: Inquiry) => {
                        return inquiry.attended ?
                            this.unattend(id, auth) :
                            inquiry;
                    })
                    .then((inquiry: Inquiry) => {
                        return inquiry.doctorType === DoctorType.PSYCHOLOGIST ?
                            this.updateDoctorType(id, DoctorType.REGULAR, auth) :
                            inquiry;
                    })
            });
    }

    private decryptInquiry(inquiry: Inquiry): Inquiry {
        inquiry.email = this.cryptoService.decrypt(inquiry.email);
        inquiry.summary = this.cryptoService.decrypt(inquiry.summary);
        inquiry.time = inquiry.time ? this.cryptoService.decrypt(inquiry.time) : null;
        inquiry.gender = inquiry.gender ? this.cryptoService.decrypt(inquiry.gender) : null;
        inquiry.genderNonBinary = inquiry.genderNonBinary ? this.cryptoService.decrypt(inquiry.genderNonBinary) : null;
        return inquiry;
    }
}
