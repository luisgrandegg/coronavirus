import { Inquiry } from "./Inquiry";
import { ObjectId } from "mongodb";

export interface IInquiryEventData {
    inquiry: Inquiry;
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
}
