import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

import { Auth } from "./Auth/Auth";

export interface IRequest {
    auth: Auth;
}

export const IpAddress = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return request.headers['x-forwarded-for'];
});
