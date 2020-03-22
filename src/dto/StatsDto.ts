import { StatType, StatPeriod } from "../Stat/Stat";

export interface IIStatsDto {
    types: StatType[];
    period: StatPeriod;
}

export interface IIStatsDtoRequest {
    types: string[];
    period: string;
}

export class IStatsDto {
    static createFromRequest(
        request: IIStatsDtoRequest
    ): IStatsDto {
        return new IStatsDto(
            request.types as StatType[],
            request.period as StatPeriod
        );
    }

    constructor(
        public types: StatType[],
        public period: StatPeriod
    ) {}

    toJSON(): IIStatsDto {
        return {
            types: this.types,
            period: this.period
        }
    }
}
