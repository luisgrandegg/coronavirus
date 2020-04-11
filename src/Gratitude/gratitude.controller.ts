import { Controller, Post, Get, HttpException, HttpStatus, Body, Param, Query, Req } from '@nestjs/common';

import { GratitudeService } from './gratitude.service';
import { Gratitude } from './Gratitude';
import { CreateGratitudeDto, ICreateGratitudeDto } from '../dto/CreateGratitudeDto';
import { ValidationError } from '../ValidationError';
import { GratitudeListParams, IGratitudeListParamsRequest } from '../dto/GratitudeListParams';
import { IRequest } from 'src/Request';

export enum Routes {
    GET = '/gratitudes',
    CREATE = '/gratitudes',
    FLAG = '/gratitudes/:id/flag',
    UNFLAG = '/gratitudes/:id/unflag',
    ACTIVATE = '/gratitudes/:id/activate',
    DEACTIVATE = '/gratitudes/:id/deactivate',
    REACT = '/gratitudes/:id/react'
}

@Controller()
export class GratitudeController {
    constructor(
        private readonly gratitudeService: GratitudeService
    ) {}

    @Get(Routes.GET)
    get(
        @Query() query: IGratitudeListParamsRequest,
        @Req() req: IRequest
    ): Promise<Gratitude[]> {
        const { auth } = req;
        const gratitudeListParams = auth?.isAdmin() ?
            GratitudeListParams.createFromRequest(query) :
            GratitudeListParams.createFromRequest({
                active: 'true',
                flagged: 'false'
            });
        return this.gratitudeService.getRandom(gratitudeListParams);
    }

    @Post(Routes.CREATE)
    async create(
        @Body() body: ICreateGratitudeDto
    ): Promise<Gratitude> {
        const createGratitudeDto = CreateGratitudeDto.createFromRequest(body);
        return this.gratitudeService.create(createGratitudeDto)
            .catch((error: Error) => {
                if (error instanceof ValidationError) {
                    throw new HttpException({
                        message: error.message,
                        key: error.key,
                        validationErrors: error.validationErrors
                    }, HttpStatus.BAD_REQUEST)
                }
                throw error;
            });
    }

    @Post(Routes.FLAG)
    flag(
        @Param('id') id: string
    ): Promise<Gratitude> {
        return this.gratitudeService.flag(id);
    }

    @Post(Routes.UNFLAG)
    unflag(
        @Param('id') id: string
    ): Promise<Gratitude> {
        return this.gratitudeService.unflag(id);
    }

    @Post(Routes.ACTIVATE)
    activate(
        @Param('id') id: string
    ): Promise<Gratitude> {
        return this.gratitudeService.activate(id);
    }

    @Post(Routes.DEACTIVATE)
    deactivate(
        @Param('id') id: string
    ): Promise<Gratitude> {
        return this.gratitudeService.deactivate(id);
    }
}
