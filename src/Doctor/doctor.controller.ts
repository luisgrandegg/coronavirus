import { Controller, Post, Body, Get, Query } from '@nestjs/common';

import { Doctor } from '../Doctor';
import { DoctorService } from './doctor.service';
import { IDoctorListParamsRequest, DoctorListParams } from '../dto/DoctorListParams';

export enum Routes {
    GET = '/doctors',
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
}
