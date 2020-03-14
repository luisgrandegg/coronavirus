export class CustomError extends Error {
    public key: string = 'UNKNOWN';

    constructor(
        public message: string,
        public code?: number,
    ) {
        super(message);
        this.code = code;
        this.name = this.constructor.name;
        if (typeof Error.captureStackTrace === 'function') {
            Error.captureStackTrace(this, this.constructor);
        } else {
            this.stack = (new Error(message)).stack;
         }
       }

  }
