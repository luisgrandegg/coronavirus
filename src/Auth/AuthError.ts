import { CustomError } from '../CustomError';

export class AuthError extends CustomError {
    public key: string = 'UNATHORIZED';

    constructor(
        public message: string = 'AuthError',
    ) {
        super(message, 401);
    }
}
