import { ObjectID } from 'mongodb';
import { EntityRepository } from 'typeorm';

import { Repository } from '../Repository';

import { ObjectIdError } from '../ObjectIdError';

import { User } from './User';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
    async findById(userId: string): Promise<User> {
        if (!ObjectID.isValid(userId)) {
            throw new ObjectIdError();
        }

        return this.findOne(userId);
    }
}
