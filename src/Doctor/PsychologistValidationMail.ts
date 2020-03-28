import { Mail } from '../Mail/Mail';
import { Doctor } from './Doctor';

export class PsychologistValidationMail extends Mail {
    static createFromDoctor(doctor: Doctor): PsychologistValidationMail {
        return new PsychologistValidationMail(
            {
                name: doctor.name
            },
            doctor.email,
        );
    }

    name = 'psychologistValidation';
}
