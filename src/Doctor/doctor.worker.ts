import * as PubSub from 'pubsub-js';

import { DoctorService } from "./doctor.service";
import { InquiryEvents, IByUserInquiryEventData } from '../Inquiry/InquiryEvents';

export class DoctorWorker {
    constructor(
        private doctorService: DoctorService
    ) {
        this.bindEvents();
    }

    bindEvents(): void {
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
