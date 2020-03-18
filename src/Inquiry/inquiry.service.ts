import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Inquiry } from './Inquiry';
import { CreateInquiryDto } from '../dto/CreateInquiryDto';
import { InquiryListParams } from '../dto/InquiryListParams';
import { InquiryRepository } from './inquiry.repository';
import { ObjectId } from 'mongodb';
import { CryptoService } from '../Crypto';

@Injectable()
export class InquiryService {
    constructor(
        @InjectRepository(Inquiry)
        private inquiryRepository: InquiryRepository,
        private cryptoService: CryptoService,
    ) {}

    async create(inquiryDto: CreateInquiryDto): Promise<Inquiry> {
        const inquiry = this.inquiryRepository.create();
        inquiry.age = inquiryDto.age;
        inquiry.email = inquiryDto.email;
        inquiry.speciality = inquiryDto.speciality;
        inquiry.summary = this.cryptoService.encrypt(inquiryDto.summary);
        inquiry.terms = inquiryDto.terms;
        inquiry.privacy = inquiryDto.privacy;
        return this.inquiryRepository.save(inquiry);
    }

    async get(inquiryListParams: InquiryListParams): Promise<Inquiry[]> {
        return this.inquiryRepository.find({
            where: { ...inquiryListParams.toJSON() },
            order: {
                createdAt: 1
            }
        }).then((inquiries: Inquiry[]): Inquiry[] => inquiries.map(
            (inquiry: Inquiry): Inquiry => {
                inquiry.summary = this.cryptoService.decrypt(inquiry.summary);
                return inquiry;
            }
        ))
    }

    async attend(id: string, doctorId: ObjectId): Promise<Inquiry> {
        return this.inquiryRepository.findOne(id)
            .then((inquiry: Inquiry) => {
                inquiry.attended = true;
                inquiry.doctorId = doctorId;
                return this.inquiryRepository.save(inquiry)
            });
    }

    async unattend(id: string): Promise<Inquiry> {
        return this.inquiryRepository.findOne(id)
            .then((inquiry: Inquiry) => {
                inquiry.attended = false;
                delete inquiry.doctorId;
                return this.inquiryRepository.save(inquiry);
            })
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
}
