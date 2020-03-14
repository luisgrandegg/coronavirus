import { Injectable } from '@nestjs/common';
import * as SendgridMail from '@sendgrid/mail';

import { Mail } from './Mail';

import { mailer, server } from '../config';

@Injectable()
export class MailService {
    constructor() {
        this.configure();
    }

    async send(mail: Mail): Promise<any> {
        if (!mail.from) {
            mail.from = mailer.from;
        }
        mail.dynamicTemplateData.domain = server.domain;
        mail.templateId = this.getTemplateId(mail);

        return SendgridMail.send(mail.toJson());
    }

    private configure(): void {
        SendgridMail.setApiKey(mailer.apiKey);
    }

    private getTemplateId(mail: Mail): string {
        return mailer.templates[mail.name];
    }
}
