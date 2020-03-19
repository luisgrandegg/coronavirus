import { ObjectID } from 'mongodb';
import { Entity, ObjectIdColumn, Column, CreateDateColumn, UpdateDateColumn, BeforeInsert } from "typeorm";
import { IsBoolean, IsString, IsEmail, IsNumber, IsOptional } from 'class-validator';

export interface IInquiry {
    createdAt: Date;
    doctorId?: string;
    age: number;
    email: string;
    id: string;
    speciality: string;
    summary: string;
    terms: boolean;
    privacy: boolean;
    attended: boolean;
    solved: boolean;
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

    @IsString()
    @Column()
    speciality: string;

    @IsString()
    @Column()
    summary: string;

    @IsBoolean()
    @Column()
    terms: boolean;

    @IsBoolean()
    @Column()
    privacy: boolean;

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

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @BeforeInsert()
    setSolved(): void {
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
            privacy: this.privacy,
            attended: this.attended,
            solved: this.solved,
            updatedAt: this.updatedAt
        };
    }
}
