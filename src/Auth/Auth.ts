import { IsOptional, IsString } from 'class-validator';
import * as crypto from 'crypto';
import { ObjectID } from 'mongodb';
import { BeforeInsert, Column, CreateDateColumn, Entity, ObjectIdColumn, UpdateDateColumn } from 'typeorm';

import { UserType } from '../User';

export interface IAuth {
    token: string;
    userId: ObjectID;
    userType: UserType;
}

@Entity()
export class Auth {
    @ObjectIdColumn()
    id: ObjectID;

    @Column()
    userId: ObjectID;

    @Column()
    userType: UserType;

    @IsString()
    @IsOptional()
    @Column()
    token: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @BeforeInsert()
    generateToken(): void {
        this.token = crypto.randomBytes(48).toString('hex');
    }

    toJSON(): IAuth {
        return {
            token: this.token,
            userId: this.userId,
            userType: this.userType
        };
    }
}
