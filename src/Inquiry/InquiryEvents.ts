import { Inquiry } from "./Inquiry";
import { ObjectId } from "mongodb";

export interface IInquiryEventData {
    inquiry: Inquiry;
    data?: any;
}
export interface IByUserInquiryEventData extends IInquiryEventData {
    userId: ObjectId;
}

export enum InquiryEvents {
    INQUIRY_CREATED = 'inquiry::created',
    INQUIRY_FLAGGED = 'inquiry::flagged',
    INQUIRY_UNFLAGGED = 'inquiry::unflagged',
    INQUIRY_ATTENDED = 'inquiry::attended',
    INQUIRY_UNATTENDED = 'inquiry::unattended',
    INQUIRY_ACTIVATED = 'inquiry::activate',
    INQUIRY_DEACTIVATED = 'inquiry::deactivated',
    INQUIRY_CHANGE_SPECIALITY = 'inquiry::change_especiality',
    INQUIRY_CHANGE_DOCTOR_TYPE = 'inquiry::change_doctor_type'
}
