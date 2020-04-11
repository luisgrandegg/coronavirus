import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GratitudeService } from './gratitude.service';
import { Gratitude } from './Gratitude';
import { GratitudeController } from './gratitude.controller';

@Module({
    exports: [
        GratitudeService
    ],
    imports: [
        TypeOrmModule.forFeature([Gratitude]),
    ],
    controllers: [GratitudeController],
    providers: [GratitudeService],
  })
  export class GratitudeModule {}
