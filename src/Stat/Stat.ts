import { ObjectID } from 'mongodb';
import { Entity, ObjectIdColumn, Column } from "typeorm";
import {  IsString, IsNumber } from 'class-validator';

export enum StatType {
    INQUIRIES = 'inquiries',
    INQUIRIES_PSYCHOLOGIST = 'inquiries_psychologist',
    INQUIRIES_ATTENDED = 'inquiries_attended',
    INQUIRIES_ATTENDED_PSYCHOLOGIST = 'inquiries_attended_psychologist',
    INQUIRIES_FLAGGED = 'inquiries_flagged',
    INQUIRIES_BANNED = 'inquiries_banned',
    DOCTORS = 'doctors',
    PSYCHOLOGISTS = 'psychologists',
    DOCTORS_VALIDATED = 'doctors_validated',
    PSYCHOLOGISTS_VALIDATED = 'psychologists_validated',
    DOCTOR_CLAPS = 'doctor_claps'
}

export enum StatPeriod {
    TOTAL = 'total',
    DAILY = 'daily'
}

export interface IStat {
    count: number;
    period: StatPeriod;
    type: StatType;
}

@Entity()
export class Stat {
    @ObjectIdColumn()
    id: ObjectID;

    @IsString()
    @Column()
    type: StatType;

    @IsString()
    @Column()
    period: StatPeriod;

    @IsNumber()
    @Column()
    count: number;

    toJSON(): IStat {
        return {
            count: this.count,
            period: this.period,
            type: this.type
        };
    }
}
