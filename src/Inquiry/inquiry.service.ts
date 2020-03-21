import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as PubSub from 'pubsub-js';

import { Inquiry } from './Inquiry';
import { CreateInquiryDto } from '../dto/CreateInquiryDto';
import { InquiryListParams } from '../dto/InquiryListParams';
import { InquiryRepository } from './inquiry.repository';
import { ObjectId } from 'mongodb';
import { CryptoService } from '../Crypto';
import { InquiryAuditService, InquiryAuditAction } from '../InquiryAudit';
import { InquiryDoesntExistsError } from './InquiryDoesntExistsError';
import { MailService } from 'src/Mail';
import { InquiryReportedMail } from './InquiryReportedMail';
import { InquiryEvents } from './InquiryEvents';

@Injectable()
export class InquiryService {
    constructor(
        @InjectRepository(Inquiry)
        private inquiryRepository: InquiryRepository,
        private cryptoService: CryptoService,
        private inquiryAuditService: InquiryAuditService,
        private mailService: MailService
    ) {
        PubSub.subscribe(
            InquiryEvents.INQUIRY_REPORTED,
            () => { this.mailService.send(InquiryReportedMail.createFromInquiry()); }
        )
    }

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

    async flag(id: string, userId: ObjectId): Promise<Inquiry> {
        return this.inquiryRepository.findOne(id)
            .then((inquiry: Inquiry) => {
                inquiry.flagged = true;
                return this.inquiryRepository.save(inquiry)
                    .then((inquiry: Inquiry) => {
                        PubSub.publish(InquiryEvents.INQUIRY_REPORTED, null);
                        return this.inquiryAuditService.create(
                            inquiry, InquiryAuditAction.FLAG, userId
                        ).then(() => inquiry)
                    });
            })
    }

    async unflag(id: string, userId: ObjectId): Promise<Inquiry> {
        return this.inquiryRepository.findOne(id)
            .then((inquiry: Inquiry) => {
                inquiry.flagged = false;
                return this.inquiryRepository.save(inquiry)
                    .then((inquiry: Inquiry) =>
                        this.inquiryAuditService.create(
                            inquiry, InquiryAuditAction.UNFLAG, userId
                        ).then(() => inquiry));
            })
    }

    async activate(id: string, userId: ObjectId): Promise<Inquiry> {
        return this.inquiryRepository.findOne(id)
            .then((inquiry: Inquiry) => {
                inquiry.active = true;
                return this.inquiryRepository.save(inquiry)
                    .then((inquiry: Inquiry) =>
                        this.inquiryAuditService.create(
                            inquiry, InquiryAuditAction.ACTIVATE, userId
                        ).then(() => inquiry));
            })
    }

    async deactivate(id: string, userId: ObjectId): Promise<Inquiry> {
        return this.inquiryRepository.findOne(id)
            .then((inquiry: Inquiry) => {
                inquiry.active = false;
                return this.inquiryRepository.save(inquiry)
                    .then((inquiry: Inquiry) =>
                        this.inquiryAuditService.create(
                            inquiry, InquiryAuditAction.DEACTIVATE, userId
                        ).then(() => inquiry));
            })
    }

    async migrate(): Promise<any> {
        return this.inquiryRepository.find()
            .then((inquiries: Inquiry[]) => {
                return inquiries.map((inquiry: Inquiry) => {
                    inquiry.flagged = false;
                    inquiry.active = true;
                    return this.inquiryRepository.save(inquiry);
                });
            })
    }
}
