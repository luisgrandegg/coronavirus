import * as PubSub from 'pubsub-js';

import { MailService } from "../Mail/mail.service";
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
            DoctorEvents.DOCTOR_VALIDATED,
            (_msg: string, data: IDoctorEventData) => {
                this.mailService.send(DoctorValidationMail.createFromDoctor(data.doctor));
            });
    }
}
