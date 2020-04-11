import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { GratitudeRepository } from './gratitude.repository';
import { Gratitude } from './Gratitude';
import { CreateGratitudeDto } from '../dto/CreateGratitudeDto';
import { GratitudeListParams } from '../dto/GratitudeListParams';

@Injectable()
export class GratitudeService {
    constructor(
        @InjectRepository(Gratitude)
        private gratitudeRepository: GratitudeRepository
    ) {}

    getRandom(gratitudeListParams?: GratitudeListParams): Promise<Gratitude[]> {
        return this.gratitudeRepository.manager.getMongoRepository(Gratitude).aggregateEntity([{
            $match: gratitudeListParams
        }, {
            $sample: {
                size: 75
            }
        }]).toArray();
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

    async flag(id: string): Promise<Gratitude> {
        return this.gratitudeRepository.findOne(id)
            .then((inquiry: Gratitude) => {
                inquiry.flagged = true;
                return this.gratitudeRepository.save(inquiry)
            });
    }

    async unflag(id: string): Promise<Gratitude> {
        return this.gratitudeRepository.findOne(id)
            .then((inquiry: Gratitude) => {
                inquiry.flagged = false;
                return this.gratitudeRepository.save(inquiry)
            });
    }

    async activate(id: string): Promise<Gratitude> {
        return this.gratitudeRepository.findOne(id)
            .then((inquiry: Gratitude) => {
                inquiry.active = true;
                return this.gratitudeRepository.save(inquiry)
            });
    }

    async deactivate(id: string): Promise<Gratitude> {
        return this.gratitudeRepository.findOne(id)
            .then((inquiry: Gratitude) => {
                inquiry.active = false;
                return this.gratitudeRepository.save(inquiry)
            });
    }
}
