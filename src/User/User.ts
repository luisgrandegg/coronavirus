import * as bcrypt from 'bcrypt';
import { IsEmail, IsString, IsEnum, IsBoolean } from "class-validator";
import { Entity, ObjectIdColumn, Column, CreateDateColumn, UpdateDateColumn, BeforeInsert } from "typeorm";
import { ObjectID } from 'mongodb';

export enum UserType {
    ADMIN = 'admin',
    DOCTOR = 'doctor',
    DOCTOR_ADMIN = 'doctor_admin',
    PATIENT = 'patient'
}

export interface IUser {
    createdAt: Date;
    email: string;
    id: ObjectID;
    type: UserType;
    terms: boolean;
    privacy: boolean;
    updatedAt: Date;
}

@Entity()
export class User {
    @ObjectIdColumn()
    id: ObjectID;

    @IsEmail()
    @Column({
        unique: true,
    })
    email: string;

    @IsString()
    @Column()
    password: string;

    @IsBoolean()
    @Column()
    terms: boolean;

    @IsBoolean()
    @Column()
    privacy: boolean;

    @IsEnum(UserType)
    @Column()
    type: UserType;

    @IsBoolean()
    @Column({
        default: false
    })
    isValidated: boolean

    @IsBoolean()
    @Column({
        default: true
    })
    isActive: boolean

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @BeforeInsert()
    hashPassword(): void {
        if (this.password) {
            this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(8));
        }
    }

    @BeforeInsert()
    setIsValidated(): void {
        if (this.type === UserType.PATIENT) {
            this.isValidated = true;
        } else {
            this.isValidated = false;
        }
    }

    @BeforeInsert()
    setIsActive(): void {
        this.isActive = true;
    }

    @BeforeInsert()
    lowerCaseEmail(): void {
        this.email = this.email.toLocaleLowerCase();
    }

    @BeforeInsert()
    setDefaultUserType(): void {
        if (!this.type) {
            this.type = UserType.PATIENT;
        }
    }

    verifyPassword(password: string): boolean {
        if (!password || !this.password) {
            return false;
        }

        return bcrypt.compareSync(password, this.password);
    }

    setPassword(password: string): void {
        this.password = password;
        this.hashPassword();
    }

    toJSON(): IUser {
        return {
            createdAt: this.createdAt,
            email: this.email,
            id: this.id,
            type: this.type,
            terms: this.terms,
            privacy: this.privacy,
            updatedAt: this.updatedAt
        };
    }
}
