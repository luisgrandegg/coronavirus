import { ObjectID } from 'mongodb';
import { EntityRepository } from 'typeorm';

import { Repository } from '../Repository';

import { ObjectIdError } from '../ObjectIdError';

import { Inquiry } from './Inquiry';

@EntityRepository(Inquiry)
export class InquiryRepository extends Repository<Inquiry> {
    async findById(inquiryId: string): Promise<Inquiry> {
        if (!ObjectID.isValid(inquiryId)) {
            throw new ObjectIdError();
        }

        return this.findOne(inquiryId);
    }
}
