import { Injectable, NestMiddleware, HttpException, HttpStatus } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

import { IRequest } from '../Request';
import { AuthService } from './auth.service';
import { AuthError } from './AuthError';

@Injectable()
export class IsAuthorizedMiddleware implements NestMiddleware {
    constructor(
        private authService: AuthService
    ) {}

    async use(
        req: Request & IRequest,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> {
        try {
            const auth = await this.authService.getByToken(req.header('Authorization'));
            if (!auth) {
                const error = new AuthError();
                throw new HttpException({
                    message: error.message,
                    key: error.key
                }, HttpStatus.UNAUTHORIZED);
            }
            req.auth = auth;
            next();
        }
        catch (error) {
            throw new HttpException({
                message: error.message,
                key: error.key
            }, HttpStatus.BAD_REQUEST);
        }
    }
}
