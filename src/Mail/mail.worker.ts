import * as PubSub from 'pubsub-js';

import { MailService } from "../Mail/mail.service";
import { DoctorValidationMail } from '../Doctor/DoctorValidationMail';
import { DoctorEvents, IDoctorEventData } from '../Doctor/DoctorEvents';
import { DoctorType } from '../Doctor/Doctor';
import { PsychologistValidationMail } from '../Doctor/PsychologistValidationMail';

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
                switch(data.doctor.doctorType) {
                    case DoctorType.REGULAR:
                        return this.mailService.send(DoctorValidationMail.createFromDoctor(data.doctor));
                    case DoctorType.PSYCHOLOGIST:
                        return this.mailService.send(PsychologistValidationMail.createFromDoctor(data.doctor));

                }
            });
    }
}
