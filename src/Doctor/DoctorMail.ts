import { Mail } from '../Mail';

import { Doctor } from './Doctor';

export class DoctorMail extends Mail {
    static ceateFromDoctor(doctor: Doctor): DoctorMail {
        return new DoctorMail(
            {
                email: doctor.email,
                license: doctor.license
            },
            'pati@citamedicaencasa.com',
        );
    }

    name = 'newDoctor';
}
