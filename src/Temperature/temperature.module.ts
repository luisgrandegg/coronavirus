import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TemperatureService } from './temperature.service';
import { Temperature } from './Temperature';

@Module({
    exports: [
        TemperatureService
    ],
    imports: [
        TypeOrmModule.forFeature([Temperature]),
    ],
    controllers: [],
    providers: [TemperatureService],
})
export class TemperatureModule {}
