import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Stat, StatType, StatPeriod } from './Stat';
import { StatRepository } from './stat.repository';
import { StatWorker } from './stat.worker';

@Injectable()
export class StatService {
    constructor(
        @InjectRepository(StatRepository)
        private statRepository: StatRepository
    ) {
        new StatWorker(this);
    }

    async get(statPeriod: StatPeriod, statTypes?: StatType[]): Promise<Stat[]> {
        if (!statTypes) {
            return this.statRepository.find({
                period: statPeriod
            })
        }
        return this.statRepository.find({
            where: {
                $or: statTypes.map((statType: StatType) => ({
                    type: statType, period: statPeriod
                }))
            }
        })
    }

    async create(type: StatType, period: StatPeriod, count: number): Promise<Stat> {
        const stat = this.statRepository.create();
        stat.count = count;
        stat.period = period;
        stat.type = type;
        return this.statRepository.save(stat);
    };

    async update(type: StatType, period: StatPeriod, count: number): Promise<Stat> {
        return this.statRepository.findOne({
            type,
            period
        }).then((stat: Stat) => {
            if (!stat) {
                return this.create(type, period, count);
            }
            stat.count = count;
            return this.statRepository.save(stat);
        });
    }

    async increase(type: StatType, period: StatPeriod): Promise<Stat> {
        return this.statRepository.findOne({
            type,
            period
        }).then((stat: Stat) => {
            if (!stat) {
                return this.create(type, period, 1);
            }
            stat.count++;
            return this.statRepository.save(stat);
        });
    }

    async decrease(type: StatType, period: StatPeriod): Promise<Stat> {
        return this.statRepository.findOne({
            type,
            period
        }).then((stat: Stat) => {
            if (!stat) {
                return this.create(type, period, 0);
            }
            stat.count--;
            return this.statRepository.save(stat);
        });
    }
}
