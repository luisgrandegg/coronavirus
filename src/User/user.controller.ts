import { Controller, Get, Req, Post, Body, Param, HttpException, HttpStatus } from '@nestjs/common';

import { UserService } from './user.service';
import { User } from './User';
import { IRequest } from '../Request';
import { UserDoesntExistsError } from './UserDoesntExistsError';

export enum Routes {
    GET = '/users',
    INVALIDATE = '/users/:id/invalidate',
    VALIDATE = '/users/:id/validate',
    ACTIVATE = '/users/:id/activate',
    DEACTIVATE = '/users/:id/deactivate'
};

@Controller()
export class UserController {
    constructor(
        private readonly userService: UserService
    ) {}

    @Get(Routes.GET)
    get(
        @Req() req: IRequest
    ): Promise<User> {
        return this.userService.getUserById(req.auth.userId.toHexString());
    }

    @Post(Routes.VALIDATE)
    async validate(
        @Param('id') id: string
    ): Promise<User | void > {
        return this.userService.validate(id)
            .catch((error: Error) => {
                if (error instanceof UserDoesntExistsError) {
                    throw new HttpException({
                        message: error.message,
                        key: error.key
                    }, HttpStatus.BAD_REQUEST)
                }
            });
    }

    @Post(Routes.INVALIDATE)
    async invalidate(
        @Param('id') id: string
    ): Promise<User | void > {
        return this.userService.invalidate(id)
            .catch((error: Error) => {
                if (error instanceof UserDoesntExistsError) {
                    throw new HttpException({
                        message: error.message,
                        key: error.key
                    }, HttpStatus.BAD_REQUEST)
                }
            });
    }

    @Post(Routes.ACTIVATE)
    async activate(
        @Param('id') id: string
    ): Promise<User | void> {
        return this.userService.activate(id)
            .catch((error: Error) => {
                if (error instanceof UserDoesntExistsError) {
                    throw new HttpException({
                        message: error.message,
                        key: error.key
                    }, HttpStatus.BAD_REQUEST)
                }
            });
    }

    @Post(Routes.DEACTIVATE)
    async deactivate(
        @Param('id') id: string
    ): Promise<User | void> {
        return this.userService.deactivate(id)
            .catch((error: Error) => {
                if (error instanceof UserDoesntExistsError) {
                    throw new HttpException({
                        message: error.message,
                        key: error.key
                    }, HttpStatus.BAD_REQUEST)
                }
            });
    }
}
