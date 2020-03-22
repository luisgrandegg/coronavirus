import { ObjectID } from 'mongodb';
import { Entity, ObjectIdColumn, Column, CreateDateColumn, UpdateDateColumn, BeforeInsert } from "typeorm";
import { IsBoolean, IsString, IsEmail, IsNumber, IsOptional } from 'class-validator';
import { DoctorType } from '../Doctor/Doctor';

export enum InquiryPagination {
    PER_PAGE = 100
}

export interface IInquiry {
    createdAt: Date;
    doctorId?: string;
    age: number;
    email: string;
    id: string;
    doctorTpe: DoctorType;
    speciality?: string;
    summary: string;
    terms: boolean;
    time: string;
    privacy: boolean;
    attended: boolean;
    solved: boolean;
    flagged: boolean;
    active: boolean;
    updatedAt: Date;
}

@Entity()
export class Inquiry {
    @ObjectIdColumn()
    id: ObjectID;

    @IsOptional()
    @Column()
    doctorId: ObjectID;

    @IsNumber()
    @Column()
    age: number;

    @IsEmail()
    @Column()
    email: string;

    @IsOptional()
    @IsString()
    @Column()
    speciality: string;

    @IsString()
    @Column()
    doctorType: DoctorType;

    @IsString()
    @Column()
    summary: string;

    @IsBoolean()
    @Column()
    terms: boolean;

    @IsString()
    @Column()
    time: string;

    @IsBoolean()
    @Column()
    privacy: boolean;

    @IsBoolean()
    @Column()
    confirmAge: boolean;

    @IsBoolean()
    @Column({
        default: false
    })
    attended: boolean;

    @IsBoolean()
    @Column({
        default: false
    })
    solved: boolean;

    @IsBoolean()
    @Column({
        default: false
    })
    flagged: boolean;

    @IsBoolean()
    @Column({
        default: true
    })
    active: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @BeforeInsert()
    setSolved(): void {
        this.active = true;
        this.attended = false;
        this.flagged = false;
        this.solved = false;
    }

    toJSON(): IInquiry {
        return {
            createdAt: this.createdAt,
            age: this.age,
            doctorId: this.doctorId ? this.doctorId.toHexString() : undefined,
            email: this.email,
            id: this.id.toHexString(),
            speciality: this.speciality,
            summary: this.summary,
            terms: this.terms,
            time: this.time,
            privacy: this.privacy,
            attended: this.attended,
            solved: this.solved,
            updatedAt: this.updatedAt,
            active: this.active,
            flagged: this.flagged,
            doctorTpe: this.doctorType
        };
    }
}
