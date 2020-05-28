import { Controller, Post, Get } from '@nestjs/common';

import { UserService } from '../User/user.service';
import { User, UserType } from '../User';
import { Inquiry } from '../Inquiry';
import { InquiryService, IInquiriesPaginated } from '../Inquiry/inquiry.service'
import { StatType, StatPeriod, Stat } from '../Stat';
import { StatService } from '../Stat/stat.service';
import { Doctor, DoctorType } from '../Doctor';
import { DoctorService } from '../Doctor/doctor.service';
import { StatsResponseDto } from '../dto/StatsResponseDto';
import { AuthService } from '../Auth/auth.service';
import { Auth } from '../Auth/Auth';
import { MailService } from '../Mail/mail.service';
import { ByeByeMail } from './ByeByeMail';
import { UserListParams } from '../dto/UserListParams';

export enum Routes {
    BYE_BYE = '/admin/bye-bye',
    MIGRATE = '/admin/migrate',
    STATS = '/admin/stats',
    SYNC_STATS = '/admin/sync-stats'
}

@Controller()
export class AdminController {
    constructor(
        private readonly authService: AuthService,
        private readonly mailService: MailService,
        private readonly userService: UserService,
        private readonly inquiryService: InquiryService,
        private readonly doctorService: DoctorService,
        private readonly statService: StatService
    ) { }

    @Post(Routes.BYE_BYE)
    async byeBye(): Promise<void> {
        // return this.userService.get(new UserListParams(true, true))
        //     .then((users: User[]) => {
        //         ['diego.garcimartin@gmail.com', 'luis.grande.garcia@gmail.com'].forEach((mail: string) => {
        //             this.mailService.send(new ByeByeMail(
        //                 {},
        //                 mail,
        //             ));
        //         });
        //         return users.map((user: User) => user.email);
        //         // users.forEach((user: User) => {
        //         //     this.mailService.send(ByeByeMail.createFromUser(user));
        //         // });
        //     });
        return this.userService.get(new UserListParams(true, true))
            .then((users: User[]) => {
                users.forEach((user: User) => {
                    this.mailService.send(ByeByeMail.createFromUser(user));
                });
            });
    }

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
        ]).then((value: [User[], IInquiriesPaginated, Doctor[]]) => {
            const [users, { inquiries }, doctors] = value;
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

    @Post(Routes.MIGRATE)
    async migrate(): Promise<{}> {
        this.authService.get()
            .then((auths: Auth[]) => {
                auths.forEach((auth: Auth) => {
                    auth.doctorType = auth.doctorType || DoctorType.REGULAR;
                    this.authService.save(auth);
                })
            })

        this.doctorService.get()
            .then((doctors: Doctor[]) => {
                doctors.forEach((doctor: Doctor) => {
                    doctor.doctorType = doctor.doctorType || DoctorType.REGULAR;
                    this.doctorService.save(doctor);
                })
            })

        this.inquiryService.get(undefined, false)
            .then((inquiriesPaginated: IInquiriesPaginated) => {
                inquiriesPaginated.inquiries.forEach((inquiry: Inquiry) => {
                    inquiry.doctorType = inquiry.doctorType || DoctorType.REGULAR;
                    this.inquiryService.save(inquiry);
                })
            })

        this.userService.get()
            .then((users: User[]) => {
                users.forEach((user: User) => {
                    user.doctorType = user.doctorType || DoctorType.REGULAR;
                    //@ts-ignore
                    user.type = user.type === 'doctor_admin' ?
                        UserType.SUPER_ADMIN :
                        user.type;
                    this.userService.save(user);
                })
            })

        return {};
    }
}
