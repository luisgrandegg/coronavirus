import * as PubSub from 'pubsub-js';

import { DoctorService } from "./doctor.service";
import { InquiryEvents, IByUserInquiryEventData } from '../Inquiry/InquiryEvents';
import { UserEvents, IUserEventData } from 'src/User/UserEvents';
import { Doctor } from './Doctor';
import { DoctorEvents } from './DoctorEvents';
import { UserType } from 'src/User';

export class DoctorWorker {
    constructor(
        private doctorService: DoctorService
    ) {
        this.bindEvents();
    }

    bindEvents(): void {
        PubSub.subscribe(
            UserEvents.USER_VALIDATION,
            (_msg: string, data: IUserEventData) => {
                if (data.user.type === UserType.DOCTOR || data.user.type === UserType.DOCTOR_ADMIN) {
                    this.doctorService.findByUserId(data.user.id).then((doctor: Doctor) => {
                        PubSub.publish(DoctorEvents.DOCTOR_VALIDATED, { doctor });
                    })
                }
            }
        )
        PubSub.subscribe(
            InquiryEvents.INQUIRY_ATTENDED,
            (_msg: string, data: IByUserInquiryEventData) => {
                this.doctorService.attendInquiry(data.userId);
            }
        )

        PubSub.subscribe(
            InquiryEvents.INQUIRY_UNATTENDED,
            (_msg: string, data: IByUserInquiryEventData) => {
                this.doctorService.unattendInquiry(data.userId);
            }
        )
    }
}
