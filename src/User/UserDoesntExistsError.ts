import { CustomError } from '../CustomError';

export class UserDoesntExistsError extends CustomError {
    constructor(
        public message: string = 'UserDoesntExistsError',
    ) {
        super(message, 400);
    }
}
