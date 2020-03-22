import { EntityRepository } from 'typeorm';

import { Repository } from '../Repository';

import { Stat } from './Stat';

@EntityRepository(Stat)
export class StatRepository extends Repository<Stat> {}
