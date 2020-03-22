import { Controller, Post, Body, HttpException, HttpStatus, Get, Param, Query, Req } from '@nestjs/common';

import { InquiryService } from './inquiry.service';
import { Inquiry } from './Inquiry';
import { CreateInquiryDto, ICreateInquiryDto } from '../dto/CreateInquiryDto';
import { InquiryListParams, IInquiryListParamsRequest } from '../dto/InquiryListParams';
import { IRequest } from '../Request';
import { InquiryDoesntExistsError } from './InquiryDoesntExistsError';

export enum Routes {
    ATTEND = '/inquiries/:id/attend',
    CREATE = '/inquiries',
    GET = '/inquiries',
    GET_ONE = '/inquiries/:id',
    SOLVE = '/inquiries/:id/solve',
    FLAG = '/inquiries/:id/flag',
    UNFLAG = '/inquiries/:id/unflag',
    UNATTEND = '/inquiries/:id/unattend',
    ACTIVATE = '/inquiries/:id/activate',
    DEACTIVATE = '/inquiries/:id/deactivate'
}

@Controller()
export class InquiryController {
    constructor(
        private readonly inquiryService: InquiryService
    ) {}

    @Post(Routes.CREATE)
    create(
        @Body() body: ICreateInquiryDto
    ): Promise<Inquiry> {
        const inquiryDto = CreateInquiryDto.createFromRequest(body);

        if (!inquiryDto.terms) {
            throw new HttpException({
                message: 'ValidationError',
                key: 'VALIDATION_ERROR',
                validationErrors: [
                    {
                        property: 'terms',
                    }
                ]
            }, HttpStatus.BAD_REQUEST);
        }

        if (!inquiryDto.privacy) {
            throw new HttpException({
                message: 'ValidationError',
                key: 'VALIDATION_ERROR',
                validationErrors: [
                    {
                        property: 'privacy',
                    }
                ]
            }, HttpStatus.BAD_REQUEST);
        }
        return this.inquiryService.create(inquiryDto);
    }

    @Post(Routes.ATTEND)
    attend(
        @Param('id') id: string,
        @Req() req: IRequest
    ): Promise<Inquiry> {
        return this.inquiryService.attend(id, req.auth.userId);
    }

    @Post(Routes.UNATTEND)
    unattend(
        @Param('id') id: string,
        @Req() req: IRequest
    ): Promise<Inquiry> {
        return this.inquiryService.unattend(id, req.auth.userId);
    }

    @Post(Routes.SOLVE)
    solve(
        @Param('id') id: string,
        @Req() req: IRequest
    ): Promise<Inquiry> {
        return this.inquiryService.solve(id, req.auth.userId.toHexString());
    }

    @Post(Routes.FLAG)
    flag(
        @Param('id') id: string,
        @Req() req: IRequest
    ): Promise<Inquiry> {
        return this.inquiryService.flag(id, req.auth.userId);
    }

    @Post(Routes.UNFLAG)
    unflag(
        @Param('id') id: string,
        @Req() req: IRequest
    ): Promise<Inquiry> {
        return this.inquiryService.unflag(id, req.auth.userId);
    }

    @Post(Routes.ACTIVATE)
    activate(
        @Param('id') id: string,
        @Req() req: IRequest
    ): Promise<Inquiry> {
        return this.inquiryService.activate(id, req.auth.userId);
    }

    @Post(Routes.DEACTIVATE)
    deactivate(
        @Param('id') id: string,
        @Req() req: IRequest
    ): Promise<Inquiry> {
        return this.inquiryService.deactivate(id, req.auth.userId);
    }

    @Get(Routes.GET)
    get(
        @Query() query: IInquiryListParamsRequest
    ): Promise<Inquiry[]> {
        const inquiryListParams = InquiryListParams.createFromRequest(query);
        return this.inquiryService.get(inquiryListParams);
    }

    @Get(Routes.GET_ONE)
    getOne(
        @Param('id') id: string
    ): Promise<Inquiry | void> {
        return this.inquiryService.getById(id)
            .catch((error: Error) => {
                if (error instanceof InquiryDoesntExistsError) {
                    throw new HttpException({
                        message: error.message,
                        key: error.key
                    }, HttpStatus.BAD_REQUEST)
                }
            });
    }
}
