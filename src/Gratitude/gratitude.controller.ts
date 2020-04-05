import { Controller, Post, Get, HttpException, HttpStatus, Body } from '@nestjs/common';

import { GratitudeService } from './gratitude.service';
import { Gratitude } from './Gratitude';
import { CreateGratitudeDto, ICreateGratitudeDto } from '../dto/CreateGratitudeDto';
import { ValidationError } from '../ValidationError';

export enum Routes {
    GET = '/gratitudes',
    CREATE = '/gratitudes',
    REACT = '/gratitudes/:id/react'
}

@Controller()
export class GratitudeController {
    constructor(
        private readonly gratitudeService: GratitudeService
    ) {}

    @Get(Routes.GET)
    async get(): Promise<Gratitude[]> {
        return this.gratitudeService.get();
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
}
