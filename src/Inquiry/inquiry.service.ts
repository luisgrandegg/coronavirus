import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as PubSub from 'pubsub-js';

import { Inquiry } from './Inquiry';
import { CreateInquiryDto } from '../dto/CreateInquiryDto';
import { InquiryListParams } from '../dto/InquiryListParams';
import { InquiryRepository } from './inquiry.repository';
import { ObjectId } from 'mongodb';
import { CryptoService } from '../Crypto';
import { InquiryDoesntExistsError } from './InquiryDoesntExistsError';
import { InquiryEvents } from './InquiryEvents';

@Injectable()
export class InquiryService {
    constructor(
        @InjectRepository(Inquiry)
        private inquiryRepository: InquiryRepository,
        private cryptoService: CryptoService
    ) {}

    async create(inquiryDto: CreateInquiryDto): Promise<Inquiry> {
        const inquiry = this.inquiryRepository.create();
        inquiry.age = inquiryDto.age;
        inquiry.email = this.cryptoService.encrypt(inquiryDto.email);
        inquiry.speciality = inquiryDto.speciality;
        inquiry.summary = this.cryptoService.encrypt(inquiryDto.summary);
        inquiry.terms = inquiryDto.terms;
        inquiry.privacy = inquiryDto.privacy;
        inquiry.confirmAge = inquiryDto.confirmAge;
        return this.inquiryRepository.save(inquiry)
            .then((inquiry: Inquiry) => {
                PubSub.publish(InquiryEvents.INQUIRY_CREATED, { inquiry });
                return inquiry;
            });
    }

    async get(inquiryListParams?: InquiryListParams): Promise<Inquiry[]> {
        if (!inquiryListParams) {
            return this.inquiryRepository.find().then((inquiries: Inquiry[]): Inquiry[] => inquiries.map(
                (inquiry: Inquiry): Inquiry => {
                    inquiry.email = this.cryptoService.decrypt(inquiry.email);
                    inquiry.summary = this.cryptoService.decrypt(inquiry.summary);
                    return inquiry;
                }
            ))
        }
        return this.inquiryRepository.find({
            where: { ...inquiryListParams.toJSON() },
            order: {
                createdAt: 1
            }
        }).then((inquiries: Inquiry[]): Inquiry[] => inquiries.map(
            (inquiry: Inquiry): Inquiry => {
                inquiry.email = this.cryptoService.decrypt(inquiry.email);
                inquiry.summary = this.cryptoService.decrypt(inquiry.summary);
                return inquiry;
            }
        ))
    }

    async getById(id: string): Promise<Inquiry> {
        return this.inquiryRepository.findOne(id)
            .then((inquiry: Inquiry) => {
                if (!inquiry) {
                    throw new InquiryDoesntExistsError();
                }
                inquiry.email = this.cryptoService.decrypt(inquiry.email);
                inquiry.summary = this.cryptoService.decrypt(inquiry.summary);
                return inquiry;
            });
    }

    async attend(id: string, userId: ObjectId): Promise<Inquiry> {
        return this.inquiryRepository.findOne(id)
            .then((inquiry: Inquiry) => {
                inquiry.attended = true;
                inquiry.doctorId = userId;
                return this.inquiryRepository.save(inquiry)
            })
            .then((inquiry: Inquiry) => {
                PubSub.publish(InquiryEvents.INQUIRY_ATTENDED, { inquiry, userId });
                return inquiry;
            });
    }

    async unattend(id: string, userId: ObjectId): Promise<Inquiry> {
        return this.inquiryRepository.findOne(id)
            .then((inquiry: Inquiry) => {
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
}
