import { CustomError } from '../CustomError';

export class UserExistsError extends CustomError {
    public key: string = 'USER_EXISTS';
    constructor(
        public message: string = 'UserExistsError',
    ) {
        super(message, 400);
    }
}
