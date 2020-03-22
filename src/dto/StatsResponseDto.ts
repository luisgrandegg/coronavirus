import { Stat } from "../Stat";

export interface IStatsResponseDto {
    [key: string]: {
        inquiries?: number;
        inquiries_attended?: number;
        inquiries_flagged?: number;
        inquiries_banned?: number;
        doctors?: number;
        doctors_validated?: number;
    }
}

export class StatsResponseDto {
    constructor(
        private stats: Stat[]
    ) {}

    toJSON(): IStatsResponseDto {
        return this.stats.reduce((statsResponse: Partial<IStatsResponseDto>, stat: Stat) => {
            statsResponse[stat.period] = statsResponse[stat.period] || {};
            statsResponse[stat.period][stat.type] = stat.count;
            return statsResponse;
        }, {});
    }
}
