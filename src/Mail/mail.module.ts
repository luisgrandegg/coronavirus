import { Module } from '@nestjs/common';

import { MailService } from './mail.service';
import { DoctorModule } from 'src/Doctor';

@Module({
    imports: [DoctorModule],
    providers: [ MailService ],
    exports: [ MailService ]
  })
  export class MailModule {}
