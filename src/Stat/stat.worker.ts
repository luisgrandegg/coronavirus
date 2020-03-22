import * as PubSub from 'pubsub-js';

import { StatService } from "./stat.service";
import { InquiryEvents } from '../Inquiry/InquiryEvents';
import { StatType, StatPeriod } from './Stat';
import { DoctorEvents } from 'src/Doctor/DoctorEvents';
import { UserEvents, IUserEventData } from 'src/User/UserEvents';
import { userInfo } from 'os';
import { UserType } from 'src/User';

export class StatWorker {
    constructor(
        private statService: StatService
    ) {
        this.bindEvents();
    }

    private bindEvents() {
        PubSub.subscribe(
            InquiryEvents.INQUIRY_CREATED,
            () => { this.statService.increase(StatType.INQUIRIES, StatPeriod.TOTAL)}
        )

        PubSub.subscribe(
            InquiryEvents.INQUIRY_ATTENDED,
            () => { this.statService.increase(StatType.INQUIRIES_ATTENDED, StatPeriod.TOTAL)}
        )

        PubSub.subscribe(
            InquiryEvents.INQUIRY_ATTENDED,
            () => { this.statService.decrease(StatType.INQUIRIES_ATTENDED, StatPeriod.TOTAL)}
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
                    data.user.type !== UserType.DOCTOR_ADMIN
                ) {
                    return;
                }
                this.statService.increase(StatType.DOCTORS, StatPeriod.TOTAL)
            }
        )

        PubSub.subscribe(
            UserEvents.USER_VALIDATION,
            (_msg: string, data: IUserEventData) => {
                if (
                    data.user.type !== UserType.DOCTOR &&
                    data.user.type !== UserType.DOCTOR_ADMIN
                ) {
                    return;
                }
                this.statService.increase(StatType.DOCTORS_VALIDATED, StatPeriod.TOTAL)
            }
        )

        PubSub.subscribe(
            UserEvents.USER_INVALIDATION,
            (_msg: string, data: IUserEventData) => {
                if (
                    data.user.type !== UserType.DOCTOR &&
                    data.user.type !== UserType.DOCTOR_ADMIN
                ) {
                    return;
                }
                this.statService.decrease(StatType.DOCTORS_VALIDATED, StatPeriod.TOTAL)
            }
        )
    }
}
