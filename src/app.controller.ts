import { Controller, Get } from '@nestjs/common';
import { StatService, Stat, StatType, StatPeriod } from './Stat';
import { StatsResponseDto } from './dto/StatsResponseDto';

export enum Routes {
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
}
