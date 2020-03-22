import * as PubSub from 'pubsub-js';

import { MailService } from "../Mail";
import { InquiryEvents } from "../Inquiry/InquiryEvents";
import { InquiryReportedMail } from "../Inquiry/InquiryReportedMail";
import { UserEvents, IUserEventData } from 'src/User/UserEvents';
import { NewDoctorMail } from '../Doctor/NewDoctorMail';
import { UserType } from '../User';
import { DoctorValidationMail } from '../Doctor/DoctorValidationMail';
import { DoctorEvents, IDoctorEventData } from 'src/Doctor/DoctorEvents';

export class MailWorker {
    constructor(
        private mailService: MailService
    ) {
        this.bindEvents()
    }

    bindEvents() {
        PubSub.subscribe(
            InquiryEvents.INQUIRY_FLAGGED,
            () => { this.mailService.send(InquiryReportedMail.createFromInquiry()); }
        );

        PubSub.subscribe(
            UserEvents.REGISTER,
            (_msg: string, data: IUserEventData) => {
                if (
                    data.user.type !== UserType.DOCTOR &&
                    data.user.type !== UserType.DOCTOR_ADMIN
                ) {
                    return;
                }
                this.mailService.send(NewDoctorMail.create());
            }
        )

        PubSub.subscribe(
            DoctorEvents.DOCTOR_VALIDATED,
            (_msg: string, data: IDoctorEventData) => {
                this.mailService.send(DoctorValidationMail.createFromDoctor(data.doctor));
            });
    }
}
