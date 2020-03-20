import { Mail } from '../Mail';

export class NewDoctorMail extends Mail {
    static createFromDoctor(): NewDoctorMail {
        return new NewDoctorMail(
            {},
            'pati@citamedicaencasa.com',
        );
    }

    name = 'newDoctor';
}
