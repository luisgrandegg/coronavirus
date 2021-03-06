import { ObjectID } from 'mongodb';
import { Entity, ObjectIdColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { IsString, IsOptional, IsEmail, IsNumber } from 'class-validator';

export enum DoctorType {
    REGULAR = 'regular',
    PSYCHOLOGIST = 'psychologist'
}
export interface IDoctor {
    createdAt: Date;
    name: string;
    surname: string;
    doctorType: DoctorType;
    speciality: string;
    license: string;
    email: string;
    phone: string;
    inquiriesAttended: number;
    updatedAt: Date;
    id: string;
    userId: string;
    comment: string;
}

@Entity()
export class Doctor {
    @ObjectIdColumn()
    id: ObjectID;

    @Column()
    userId: ObjectID;

    @IsString()
    @Column()
    name: string;

    @IsString()
    @Column()
    surname: string;

    @IsString()
    @Column()
    doctorType: DoctorType;

    @IsString()
    @IsOptional()
    @Column()
    speciality: string;

    @IsString()
    @IsOptional()
    @Column()
    comment: string;

    @IsString()
    @Column()
    license: string;

    @IsEmail()
    @Column()
    email: string;

    @IsString()
    @Column()
    phone: string;

    @IsOptional()
    @IsNumber()
    @Column()
    inquiriesAttended: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    toJSON(): IDoctor {
        return {
            createdAt: this.createdAt,
            name: this.name,
            surname: this.surname,
            speciality: this.speciality,
            license: this.license,
            email: this.email,
            phone: this.phone,
            updatedAt: this.updatedAt,
            inquiriesAttended: this.inquiriesAttended,
            id: this.id.toHexString(),
            userId: this.userId.toHexString(),
            comment: this.comment,
            doctorType: this.doctorType
        };
    }
}
