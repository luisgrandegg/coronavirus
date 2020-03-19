import { Controller, Post, Body, Get, Query, Param } from '@nestjs/common';

import { Doctor } from '../Doctor';
import { DoctorService } from './doctor.service';
import { IDoctorListParamsRequest, DoctorListParams } from '../dto/DoctorListParams';

export enum Routes {
    GET = '/doctors',
    VALIDATE = '/doctors/:id/validate'
}

@Controller()
export class DoctorController {
    constructor(
        private readonly doctorService: DoctorService
    ) {}

    @Get(Routes.GET)
    async get(
        @Query() query: IDoctorListParamsRequest
    ): Promise<Doctor[]> {
        const doctorListParams = DoctorListParams.createFromRequest(query);
        return this.doctorService.get(doctorListParams);
    }

    @Post(Routes.VALIDATE)
    async validate(
        @Param('id') id: string
    ): Promise<Doctor> {
        return this.doctorService.validate(id);
    }
}
