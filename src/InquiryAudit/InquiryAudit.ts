import { ObjectID } from 'mongodb';
import { Entity, ObjectIdColumn, Column, CreateDateColumn, UpdateDateColumn, BeforeInsert } from "typeorm";
import { IsBoolean, IsString, IsEmail, IsNumber, IsOptional } from 'class-validator';

export enum InquiryAuditAction {
    ACTIVATE = 'activate',
    DEACTIVATE = 'deactivate',
    CREATE = 'create',
    ASSIGN = 'assign',
    UNASSIGN = 'unassign',
    FLAG = 'flag',
    UNFLAG = 'unflag',
    CHANGE_SPECIALITY = 'change_speciality'
}

export interface IInquiryAudit {
    createdAt: Date;
    id: string;
    inquiryId: string;
    userId?: string;
    data: any;
    action: string;
    updatedAt: Date;
}

@Entity()
export class InquiryAudit {
    @ObjectIdColumn()
    id: ObjectID;

    @IsOptional()
    @Column()
    userId: ObjectID;

    @Column()
    inquiryId: ObjectID;

    @IsString()
    @Column()
    action: string;

    @IsOptional()
    @Column()
    data: any;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    toJSON(): IInquiryAudit {
        return {
            createdAt: this.createdAt,
            id: this.id.toHexString(),
            inquiryId: this.inquiryId.toHexString(),
            userId: this.userId.toHexString(),
            action: this.action,
            updatedAt: this.updatedAt,
            data: this.data
        };
    }
}
