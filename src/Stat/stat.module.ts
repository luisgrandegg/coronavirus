import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { StatService } from './stat.service';
import { Stat } from './Stat';
import { StatRepository } from './stat.repository';

@Module({
    exports: [
        StatService
    ],
    imports: [
        TypeOrmModule.forFeature([Stat, StatRepository]),
    ],
    controllers: [],
    providers: [StatService],
  })
  export class StatModule {}
