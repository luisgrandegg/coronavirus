import { EntityRepository } from 'typeorm';

import { Repository } from '../Repository';

import { Gratitude } from './Gratitude';
import { GratitudeListParams } from '../dto/GratitudeListParams';

@EntityRepository(Gratitude)
export class GratitudeRepository extends Repository<Gratitude> {
    async findRandom(gratitudeListParams?: GratitudeListParams): Promise<Gratitude[]> {
        return this.manager.getMongoRepository(Gratitude).aggregateEntity([{
            $match: gratitudeListParams
        }, {
            $sample: {
                size: 75
            }
        }]).toArray();
    }
}
