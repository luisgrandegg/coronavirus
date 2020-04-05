import { EntityRepository } from 'typeorm';

import { Repository } from '../Repository';

import { Gratitude } from './Gratitude';

@EntityRepository(Gratitude)
export class GratitudeRepository extends Repository<Gratitude> {}
