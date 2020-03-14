import { CustomError } from './CustomError';

export class ObjectIdError extends CustomError {

  constructor(
    message?: string,
  ) {
    super(message, 400);
  }
}
