import { ValidationError as ClassValidatorValidationError } from 'class-validator';

import { CustomError } from './CustomError';

export class ValidationError extends CustomError {
    public key: string = 'VALIDATION_ERROR';

    constructor(
        public validationErrors: ClassValidatorValidationError[],
    ) {
        super('ValidationError', 400);
    }
}
