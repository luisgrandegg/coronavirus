import * as IpInfo from 'ipinfo';
import * as PubSub from 'pubsub-js';

import { InquiryService } from "./inquiry.service";
import { InquiryEvents, IInquiryEventData } from "./InquiryEvents";
import { ipInfo } from '../config';

export class InquiryWorker {
    constructor(
        private inquiryService: InquiryService
    ){
        this.bindEvents();
    }

    bindEvents(): void {
        PubSub.subscribe(
            InquiryEvents.INQUIRY_CREATED,
            async (_msg: string, data: IInquiryEventData): Promise<void> => {
                const { inquiry } = data;
                inquiry.ipInfo = await this.geolocate(inquiry.ipAddress);
                this.inquiryService.save(inquiry);
            }
        )
    }

    private geolocate(ipAddress: string): Promise<object | null> {
        return new Promise((resolve, reject) => {
            if (!ipAddress) {
                return resolve(null);
            }
            IpInfo(ipAddress, ipInfo.token, (error, result) => {
                if (error) {
                    return reject(error);
                }
                return resolve(result);
            });
        })
    }
}
