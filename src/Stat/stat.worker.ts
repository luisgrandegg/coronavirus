import * as PubSub from 'pubsub-js';

import { StatService } from "./stat.service";
import { InquiryEvents, IInquiryEventData } from '../Inquiry/InquiryEvents';
import { StatType, StatPeriod } from './Stat';
import { UserEvents, IUserEventData } from 'src/User/UserEvents';
import { UserType } from '../User/User';
import { DoctorType } from 'src/Doctor/Doctor';

export class StatWorker {
    constructor(
        private statService: StatService
    ) {
        this.bindEvents();
    }

    private bindEvents() {
        PubSub.subscribe(
            InquiryEvents.INQUIRY_CREATED,
            (_msg: string, data: IInquiryEventData) => {
                this.statService.increase(StatType.INQUIRIES, StatPeriod.TOTAL);
                if (data.inquiry.doctorType === DoctorType.PSYCHOLOGIST) {
                    this.statService.increase(StatType.INQUIRIES_PSYCHOLOGIST, StatPeriod.TOTAL);
                }
            }
        )

        PubSub.subscribe(
            InquiryEvents.INQUIRY_ATTENDED,
            (_msg: string, data: IInquiryEventData) => {
                this.statService.increase(StatType.INQUIRIES_ATTENDED, StatPeriod.TOTAL);
                if (data.inquiry.doctorType === DoctorType.PSYCHOLOGIST) {
                    this.statService.increase(StatType.INQUIRIES_ATTENDED_PSYCHOLOGIST, StatPeriod.TOTAL);
                }
            }
        )

        PubSub.subscribe(
            InquiryEvents.INQUIRY_UNATTENDED,
            (_msg: string, data: IInquiryEventData) => {
                this.statService.decrease(StatType.INQUIRIES_ATTENDED, StatPeriod.TOTAL);
                if (data.inquiry.doctorType === DoctorType.PSYCHOLOGIST) {
                    this.statService.decrease(StatType.INQUIRIES_ATTENDED_PSYCHOLOGIST, StatPeriod.TOTAL);
                }
            }
        )

        PubSub.subscribe(
            InquiryEvents.INQUIRY_FLAGGED,
            () => { this.statService.increase(StatType.INQUIRIES_FLAGGED, StatPeriod.TOTAL)}
        )

        PubSub.subscribe(
            InquiryEvents.INQUIRY_UNFLAGGED,
            () => { this.statService.decrease(StatType.INQUIRIES_FLAGGED, StatPeriod.TOTAL)}
        )

        PubSub.subscribe(
            InquiryEvents.INQUIRY_DEACTIVATED,
            () => { this.statService.increase(StatType.INQUIRIES_BANNED, StatPeriod.TOTAL)}
        )

        PubSub.subscribe(
            InquiryEvents.INQUIRY_ACTIVATED,
            () => { this.statService.decrease(StatType.INQUIRIES_FLAGGED, StatPeriod.TOTAL)}
        )

        PubSub.subscribe(
            UserEvents.REGISTER,
            (_msg: string, data: IUserEventData) => {
                if (
                    data.user.type !== UserType.DOCTOR &&
                    data.user.type !== UserType.SUPER_ADMIN
                ) {
                    return;
                }
                if (data.user.doctorType === DoctorType.REGULAR) {
                    this.statService.increase(StatType.DOCTORS, StatPeriod.TOTAL)
                } else if (data.user.doctorType === DoctorType.PSYCHOLOGIST) {
                    this.statService.increase(StatType.PSYCHOLOGISTS, StatPeriod.TOTAL)
                }
            }
        )

        PubSub.subscribe(
            UserEvents.USER_VALIDATION,
            (_msg: string, data: IUserEventData) => {
                if (
                    data.user.type !== UserType.DOCTOR &&
                    data.user.type !== UserType.SUPER_ADMIN
                ) {
                    return;
                }
                if (data.user.doctorType === DoctorType.REGULAR) {
                    this.statService.increase(StatType.DOCTORS_VALIDATED, StatPeriod.TOTAL)
                } else if (data.user.doctorType === DoctorType.PSYCHOLOGIST) {
                    this.statService.increase(StatType.PSYCHOLOGISTS_VALIDATED, StatPeriod.TOTAL)
                }
            }
        )

        PubSub.subscribe(
            UserEvents.USER_INVALIDATION,
            (_msg: string, data: IUserEventData) => {
                if (
                    data.user.type !== UserType.DOCTOR &&
                    data.user.type !== UserType.SUPER_ADMIN
                ) {
                    return;
                }
                if (data.user.doctorType === DoctorType.REGULAR) {
                    this.statService.decrease(StatType.DOCTORS_VALIDATED, StatPeriod.TOTAL)
                } else if (data.user.doctorType === DoctorType.PSYCHOLOGIST) {
                    this.statService.decrease(StatType.PSYCHOLOGISTS_VALIDATED, StatPeriod.TOTAL)
                }
            }
        )
    }
}
