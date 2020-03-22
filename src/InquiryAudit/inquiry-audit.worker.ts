import * as PubSub from 'pubsub-js';

import { InquiryEvents, IByUserInquiryEventData, IInquiryEventData } from "../Inquiry/InquiryEvents";
import { InquiryAuditAction } from "./InquiryAudit";
import { InquiryAuditService } from "./inquiry-audit.service";

export class InquiryAuditWorker {
    constructor(
        private inquiryAuditService: InquiryAuditService
    ){
        this.bindEvents();
    }

    bindEvents(): void {
        PubSub.subscribe(
            InquiryEvents.INQUIRY_CREATED,
            (_msg: string, data: IInquiryEventData): void => {
                this.inquiryAuditService.create(
                    data.inquiry, InquiryAuditAction.CREATE
                )
            }
        )

        PubSub.subscribe(
            InquiryEvents.INQUIRY_ATTENDED,
            (_msg: string, data: IByUserInquiryEventData): void => {
                this.inquiryAuditService.create(
                    data.inquiry, InquiryAuditAction.ASSIGN, data.userId
                )
            }
        )

        PubSub.subscribe(
            InquiryEvents.INQUIRY_UNATTENDED,
            (_msg: string, data: IByUserInquiryEventData): void => {
                this.inquiryAuditService.create(
                    data.inquiry, InquiryAuditAction.UNASSIGN, data.userId
                )
            }
        )

        PubSub.subscribe(
            InquiryEvents.INQUIRY_FLAGGED,
            (_msg: string, data: IByUserInquiryEventData): void => {
                this.inquiryAuditService.create(
                    data.inquiry, InquiryAuditAction.FLAG, data.userId
                )
            }
        )

        PubSub.subscribe(
            InquiryEvents.INQUIRY_UNFLAGGED,
            (_msg: string, data: IByUserInquiryEventData): void => {
                this.inquiryAuditService.create(
                    data.inquiry, InquiryAuditAction.UNFLAG, data.userId
                )
            }
        )

        PubSub.subscribe(
            InquiryEvents.INQUIRY_ACTIVATED,
            (_msg: string, data: IByUserInquiryEventData): void => {
                this.inquiryAuditService.create(
                    data.inquiry, InquiryAuditAction.ACTIVATE, data.userId
                )
            }
        )

        PubSub.subscribe(
            InquiryEvents.INQUIRY_DEACTIVATED,
            (_msg: string, data: IByUserInquiryEventData): void => {
                this.inquiryAuditService.create(
                    data.inquiry, InquiryAuditAction.DEACTIVATE, data.userId
                )
            }
        )
    }
}
