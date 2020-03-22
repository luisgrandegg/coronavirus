import { Controller, Post, Body, HttpException, HttpStatus, Get } from '@nestjs/common';

import { UserService, User } from '../User';
import { InquiryService, Inquiry } from '../Inquiry';
import { StatService, StatType, StatPeriod, Stat } from '../Stat';
import { DoctorService, Doctor } from '../Doctor';
import { StatsResponseDto } from '../dto/StatsResponseDto';

export enum Routes {
    STATS = '/admin/stats',
    SYNC_STATS = '/admin/sync-stats'
}

@Controller()
export class AdminController {
    constructor(
        private readonly userService: UserService,
        private readonly inquiryService: InquiryService,
        private readonly doctorService: DoctorService,
        private readonly statService: StatService
    ) {}


    @Get(Routes.STATS)
    async stats(): Promise<StatsResponseDto> {
        return this.statService.get(
            StatPeriod.TOTAL
        ).then((stats: Stat[]) => new StatsResponseDto(stats));
    }

    @Post(Routes.SYNC_STATS)
    async syncStats(): Promise<{}> {
        Promise.all([
            this.userService.get(),
            this.inquiryService.get(),
            this.doctorService.get()
        ]).then((value: [User[], Inquiry[], Doctor[]]) => {
            const [users, inquiries, doctors] = value;
            const stats = {
                [StatType.INQUIRIES]: 0,
                [StatType.INQUIRIES_ATTENDED]: 0,
                [StatType.INQUIRIES_FLAGGED]: 0,
                [StatType.INQUIRIES_BANNED]: 0,
                [StatType.DOCTORS]: 0,
                [StatType.DOCTORS_VALIDATED]: 0
            };
            const doctorStats = {};
            users.forEach((user: User) => {
                stats[StatType.DOCTORS]++;
                user.isValidated && stats[StatType.DOCTORS_VALIDATED]++;
            });
            inquiries.forEach((inquiry: Inquiry) => {
                stats[StatType.INQUIRIES]++;
                inquiry.attended && stats[StatType.INQUIRIES_ATTENDED]++
                inquiry.flagged && stats[StatType.INQUIRIES_FLAGGED]++
                !inquiry.active && stats[StatType.INQUIRIES_BANNED]++
                if (inquiry.doctorId) {
                    const doctorId = inquiry.doctorId.toHexString()
                    doctorStats[doctorId] = doctorStats[doctorId] || 0;
                    doctorStats[doctorId]++;
                }
                inquiry.doctorId && doctorStats
            });

            doctors.forEach((doctor: Doctor) => {
                doctor.inquiriesAttended = doctorStats[doctor.userId.toHexString()] || 0;
                this.doctorService.save(doctor);
            });

            Object.keys(stats).forEach((statName: StatType) => {
                this.statService.update(statName, StatPeriod.TOTAL, stats[statName]);
            });
        });

        return {};
    }
}
