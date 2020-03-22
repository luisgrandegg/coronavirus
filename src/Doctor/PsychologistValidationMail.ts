import { Mail } from '../Mail/Mail';
import { Doctor } from './Doctor';
import { DoctorValidationMail } from './DoctorValidationMail';

export class PsychologistValidationMail extends Mail {
    static createFromDoctor(doctor: Doctor): DoctorValidationMail {
        return new DoctorValidationMail(
            {
                name: doctor.name
            },
            doctor.email,
        );
    }

    name = 'psychologistValidation';
}
