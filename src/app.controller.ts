import { Controller, Get, Post } from '@nestjs/common';
import { Stat, StatType, StatPeriod } from './Stat/Stat';
import { StatService } from './Stat/stat.service';
import { StatsResponseDto } from './dto/StatsResponseDto';

export enum Routes {
    CLAPS = '/claps',
    HEALTH = '/health',
    STATS = '/stats'
}

@Controller()
export class AppController {
    constructor(
        private readonly statService: StatService
    ) {

    }
    @Get(Routes.HEALTH)
    health(): {} {
        return {};
    }

    @Get(Routes.STATS)
    async stats(): Promise<StatsResponseDto> {
        return this.statService.get(
            StatPeriod.TOTAL,
            [StatType.INQUIRIES_ATTENDED, StatType.DOCTORS_VALIDATED],
        ).then((stats: Stat[]) => new StatsResponseDto(stats));
    }

    @Get(Routes.CLAPS)
    async claps(): Promise<Stat> {
        return this.statService.get(StatPeriod.TOTAL, [StatType.DOCTOR_CLAPS])
            .then((stats: Stat[]) => stats[0])
    }

    @Post(Routes.CLAPS)
    async clap(): Promise<Stat> {
        return this.statService.increase(StatType.DOCTOR_CLAPS, StatPeriod.TOTAL);
    }
}
