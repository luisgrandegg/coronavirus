import { Mail } from '../Mail/Mail';

import { Doctor } from './Doctor';

export class DoctorValidationMail extends Mail {
    static createFromDoctor(doctor: Doctor): DoctorValidationMail {
        return new DoctorValidationMail(
            {
                name: doctor.name
            },
            doctor.email,
        );
    }

    name = 'doctorValidation';
}
