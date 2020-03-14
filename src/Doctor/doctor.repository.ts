import { ObjectID } from 'mongodb';
import { EntityRepository } from 'typeorm';

import { Repository } from '../Repository';

import { ObjectIdError } from '../ObjectIdError';

import { Doctor } from './Doctor';

@EntityRepository(Doctor)
export class DoctorRepository extends Repository<Doctor> {
    async findById(doctorId: string): Promise<Doctor> {
        if (!ObjectID.isValid(doctorId)) {
            throw new ObjectIdError();
        }

        return this.findOne(doctorId);
    }

    async findByUserId(userId: ObjectID): Promise<Doctor[]> {
        return this.find({
            userId
        });
    }
}
