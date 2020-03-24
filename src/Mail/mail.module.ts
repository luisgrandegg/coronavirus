import { Module } from '@nestjs/common';

import { MailService } from './mail.service';
import { DoctorModule } from '../Doctor/doctor.module';

@Module({
    imports: [DoctorModule],
    providers: [ MailService ],
    exports: [ MailService ]
  })
  export class MailModule {}
