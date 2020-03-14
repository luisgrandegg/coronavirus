import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Feeling, FeelingType } from './Feeling';
import { Auth } from '../Auth';

@Injectable()
export class FeelingService {
    constructor(
        @InjectRepository(Feeling)
        private FeelingRepository: Repository<Feeling>
    ) {}

    async create(type: FeelingType, auth: Auth): Promise<Feeling> {
        const Feeling = this.FeelingRepository.create();
        Feeling.type = type;
        Feeling.userId = auth.userId;
        return this.FeelingRepository.save(Feeling);
    }
}
