import { Controller, Post, Body, Get, Query, Param } from '@nestjs/common';

import { Doctor } from '../Doctor/Doctor';
import { DoctorService } from './doctor.service';
import { IDoctorListParamsRequest, DoctorListParams } from '../dto/DoctorListParams';
import { DoctorCommentDto, IDoctorCommentDto } from 'src/dto/DoctorCommentDto';

export enum Routes {
    GET = '/doctors',
    COMMENT = '/doctors/:id/comment'
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

    @Post(Routes.COMMENT)
    async post(
        @Param('id') id: string,
        @Body() body: IDoctorCommentDto
    ): Promise<Doctor> {
        const doctorCommentDto = DoctorCommentDto.createFromRequest(body);
        return this.doctorService.comment(id, doctorCommentDto);
    }
}
