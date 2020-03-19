import { ObjectID } from 'mongodb';
import { Entity, ObjectIdColumn, Column, CreateDateColumn, UpdateDateColumn, BeforeInsert } from "typeorm";
import { IsBoolean, IsString, IsEmail, IsNumber, IsOptional } from 'class-validator';

export enum InquiryAuditAction {
    CREATE = 'create',
    ASSIGN = 'assign',
    UNASSIGN = 'unassign',
    FLAG = 'flag',
    UNFLAG = 'unflag'
}

export interface IInquiryAudit {
    createdAt: Date;
    id: string;
    inquiryId: string;
    userId?: string;
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
            updatedAt: this.updatedAt
        };
    }
}
