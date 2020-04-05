import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { GratitudeRepository } from './gratitude.repository';
import { Gratitude } from './Gratitude';
import { CreateGratitudeDto } from 'src/dto/CreateGratitudeDto';

@Injectable()
export class GratitudeService {
    constructor(
        @InjectRepository(GratitudeRepository)
        private gratitudeRepository: GratitudeRepository
    ) {}

    get(): Promise<Gratitude[]> {
        return this.gratitudeRepository.find();
    }

    create(createGratitudeDto: CreateGratitudeDto): Promise<Gratitude> {
        const gratitude = new Gratitude();
        gratitude.title = createGratitudeDto.title;
        gratitude.message = createGratitudeDto.message;
        gratitude.name = createGratitudeDto.name;
        gratitude.imagePublicId = createGratitudeDto.imagePublicId;
        gratitude.imageUrl = createGratitudeDto.imagePublicUrl;
        return this.gratitudeRepository.save(gratitude);
    }
}
