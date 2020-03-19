import { Controller, Get, Req, Post, Body, Param, HttpException, HttpStatus } from '@nestjs/common';

import { UserService } from './user.service';
import { User } from './User';
import { IRequest } from '../Request';
import { FeelingService } from '../Feeling/feeling.service';
import { TemperatureService } from '../Temperature/temperature.service';
import { IFeelingRequestDto, FeelingRequestDto } from '../dto/FeelingRequestDto';
import { ITemperatureRequestDto, TemperatureRequestDto } from '../dto/TemperatureRequestDto';
import { UserDoesntExistsError } from './UserDoesntExistsError';

export enum Routes {
    GET = '/users',
    REGISTER_TEMPERATURE = '/users/temperature',
    REGISTER_FEELING = '/users/feeling',
    VALIDATE = '/users/:id/validate',
    DEACTIVATE = '/users/:id/deactivate'
};

@Controller()
export class UserController {
    constructor(
        private readonly feelingService: FeelingService,
        private readonly temperatureService: TemperatureService,
        private readonly userService: UserService
    ) {}

    @Get(Routes.GET)
    get(
        @Req() req: IRequest
    ): Promise<User> {
        return this.userService.getUserById(req.auth.userId.toHexString());
    }

    @Post(Routes.REGISTER_TEMPERATURE)
    registerTemperature(
        @Body() body: ITemperatureRequestDto,
        @Req() req: IRequest
    ) {
        const temperatureRequestDto = TemperatureRequestDto.createFromRequest(body);
        return this.temperatureService.create(temperatureRequestDto.measure, req.auth)
    }

    @Post(Routes.REGISTER_FEELING)
    registerFeeling(
        @Body() body: IFeelingRequestDto,
        @Req() req: IRequest
    ) {
        const feelingRequestDto = FeelingRequestDto.createFromRequest(body);
        return this.feelingService.create(feelingRequestDto.type, req.auth)
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
