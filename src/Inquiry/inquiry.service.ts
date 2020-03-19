import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Inquiry } from './Inquiry';
import { CreateInquiryDto } from '../dto/CreateInquiryDto';
import { InquiryListParams } from '../dto/InquiryListParams';
import { InquiryRepository } from './inquiry.repository';
import { ObjectId } from 'mongodb';
import { CryptoService } from '../Crypto';
import { InquiryAuditService, InquiryAuditAction } from '../InquiryAudit';

@Injectable()
export class InquiryService {
    constructor(
        @InjectRepository(Inquiry)
        private inquiryRepository: InquiryRepository,
        private cryptoService: CryptoService,
        private inquiryAuditService: InquiryAuditService
    ) {}

    async create(inquiryDto: CreateInquiryDto): Promise<Inquiry> {
        const inquiry = this.inquiryRepository.create();
        inquiry.age = inquiryDto.age;
        inquiry.email = this.cryptoService.encrypt(inquiryDto.email);
        inquiry.speciality = inquiryDto.speciality;
        inquiry.summary = this.cryptoService.encrypt(inquiryDto.summary);
        inquiry.terms = inquiryDto.terms;
        inquiry.privacy = inquiryDto.privacy;
        return this.inquiryRepository.save(inquiry)
            .then((inquiry: Inquiry) =>
                this.inquiryAuditService.create(inquiry, InquiryAuditAction.CREATE).then(() => inquiry));
    }

    async get(inquiryListParams: InquiryListParams): Promise<Inquiry[]> {
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

    async attend(id: string, userId: ObjectId): Promise<Inquiry> {
        return this.inquiryRepository.findOne(id)
            .then((inquiry: Inquiry) => {
                inquiry.attended = true;
                inquiry.doctorId = userId;
                return this.inquiryRepository.save(inquiry)
                    .then((inquiry: Inquiry) =>
                        this.inquiryAuditService.create(
                            inquiry, InquiryAuditAction.ASSIGN, userId
                        ).then(() => inquiry));
            });
    }

    async unattend(id: string, userId: ObjectId): Promise<Inquiry> {
        return this.inquiryRepository.findOne(id)
            .then((inquiry: Inquiry) => {
                inquiry.attended = false;
                delete inquiry.doctorId;
                return this.inquiryRepository.save(inquiry)
                .then((inquiry: Inquiry) =>
                    this.inquiryAuditService.create(
                        inquiry, InquiryAuditAction.UNASSIGN, userId
                    ).then(() => inquiry));
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

    async encrypt(): Promise<Inquiry[]> {
        return this.inquiryRepository.find()
            .then((inquiries: Inquiry[]) => {
                return inquiries.map((inquiry: Inquiry): any => {
                    inquiry.summary = this.cryptoService.encrypt(inquiry.summary);
                    inquiry.email = this.cryptoService.encrypt(inquiry.email);
                    return this.inquiryRepository.save(inquiry);
                })
            })
    }
}
