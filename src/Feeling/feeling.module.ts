import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FeelingService } from './feeling.service';
import { Feeling } from './Feeling';

@Module({
    exports: [
        FeelingService
    ],
    imports: [
        TypeOrmModule.forFeature([Feeling]),
    ],
    controllers: [],
    providers: [FeelingService],
})
export class FeelingModule {}
