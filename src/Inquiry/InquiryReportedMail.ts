import { Mail } from '../Mail';

export class InquiryReportedMail extends Mail {
    static createFromInquiry(): InquiryReportedMail {
        return new InquiryReportedMail(
            {},
            'pati@citamedicaencasa.com',
        );
    }

    name = 'inquiryReported';
}
