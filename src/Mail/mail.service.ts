import { Injectable } from '@nestjs/common';
import * as SendgridMail from '@sendgrid/mail';

import { Mail } from './Mail';

import { mailer } from '../config';
import { MailWorker } from './mail.worker';

@Injectable()
export class MailService {
    constructor() {
        new MailWorker(this);
        this.configure();
    }

    async send(mail: Mail): Promise<any> {
        if (!mailer.apiKey) {
            return;
        }
        if (!mail.from) {
            mail.from = mailer.from;
        }
        mail.templateId = this.getTemplateId(mail);

        return SendgridMail.send(mail.toJson());
    }

    private configure(): void {
        if (mailer.apiKey) {
            SendgridMail.setApiKey(mailer.apiKey);
        }
    }

    private getTemplateId(mail: Mail): string {
        return mailer.templates[mail.name];
    }
}
