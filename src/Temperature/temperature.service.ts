import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Temperature } from './Temperature';
import { Auth } from '../Auth';

@Injectable()
export class TemperatureService {
    constructor(
        @InjectRepository(Temperature)
        private temperatureRepository: Repository<Temperature>
    ) {}

    async create(measure: number, auth: Auth): Promise<Temperature> {
        const temperature = this.temperatureRepository.create();
        temperature.measure = measure;
        temperature.userId = auth.userId;
        return this.temperatureRepository.save(temperature);
    }
}
