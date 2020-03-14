import { Controller, Get, Req, Post, Body } from '@nestjs/common';

import { UserService } from './user.service';
import { User } from './User';
import { IRequest } from '../Request';
import { FeelingService } from '../Feeling/feeling.service';
import { TemperatureService } from '../Temperature/temperature.service';
import { IFeelingRequestDto, FeelingRequestDto } from '../dto/FeelingRequestDto';
import { ITemperatureRequestDto, TemperatureRequestDto } from '../dto/TemperatureRequestDto';

export enum Routes {
    GET = '/users',
    REGISTER_TEMPERATURE = '/users/temperature',
    REGISTER_FEELING = '/users/feeling'
}

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
}
