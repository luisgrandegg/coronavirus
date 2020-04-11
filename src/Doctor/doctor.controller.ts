import { Controller, Post, Body, Get, Query, Param, Req } from '@nestjs/common';

import { Doctor } from '../Doctor/Doctor';
import { DoctorService } from './doctor.service';
import { IDoctorListParamsRequest, DoctorListParams } from '../dto/DoctorListParams';
import { DoctorCommentDto, IDoctorCommentDto } from '../dto/DoctorCommentDto';
import { IRequest } from '../Request';

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
        @Query() query: IDoctorListParamsRequest,
        @Req() req: IRequest
    ): Promise<Doctor[]> {
        const doctorType = req.auth.isSuperAdmin() ? undefined : req.auth.doctorType;
        const doctorListParams = DoctorListParams.createFromRequest(query, doctorType);
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
