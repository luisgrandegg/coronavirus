import { Mail } from '../Mail';

export class NewDoctorMail extends Mail {
    static create(): NewDoctorMail {
        return new NewDoctorMail(
            {},
            'pati@citamedicaencasa.com',
        );
    }

    name = 'newDoctor';
}
