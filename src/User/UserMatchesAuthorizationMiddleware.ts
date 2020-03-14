import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

import { IRequest } from '../Request';

@Injectable()
export class UserMatchesAuthorizationMiddleware implements NestMiddleware {
    use(
        req: IRequest & Request,
        res: Response,
        next: NextFunction
    ): Response | void {
        if (req.auth.userId.toString() !== req.params.userId) {
            return res.status(401).json({});
        }
        next();
    }
}
