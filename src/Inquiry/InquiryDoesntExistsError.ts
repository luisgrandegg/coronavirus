import { CustomError } from '../CustomError';

export class InquiryDoesntExistsError extends CustomError {
    constructor(
        public message: string = 'InquiryDoesntExistsError',
    ) {
        super(message, 400);
    }
}
