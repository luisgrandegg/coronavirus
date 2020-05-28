import { Mail } from '../Mail/Mail';
import { User } from '../User';

export class ByeByeMail extends Mail {
    static createFromUser(user: User): ByeByeMail {
        return new ByeByeMail(
            {},
            user.email,
        );
    }

    name = 'byeBye';
}
