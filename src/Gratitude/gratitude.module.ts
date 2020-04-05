import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GratitudeService } from './gratitude.service';
import { Gratitude } from './Gratitude';
import { GratitudeRepository } from './gratitude.repository';
import { GratitudeController } from './gratitude.controller';

@Module({
    exports: [
        GratitudeService
    ],
    imports: [
        TypeOrmModule.forFeature([Gratitude, GratitudeRepository]),
    ],
    controllers: [GratitudeController],
    providers: [GratitudeService],
  })
  export class GratitudeModule {}
