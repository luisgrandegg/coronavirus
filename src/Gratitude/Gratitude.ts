import { ObjectID } from 'mongodb';
import { Entity, ObjectIdColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";
import {  IsString } from 'class-validator';

export interface IGratitude {
    id: string;
    title: string;
    message: string;
    name: string;
    createdAt: string;
}

@Entity()
export class Gratitude {
    @ObjectIdColumn()
    id: ObjectID;

    @IsString()
    @Column()
    title: string;

    @IsString()
    @Column()
    message: string;

    @IsString()
    @Column()
    name: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    toJSON(): IGratitude {
        return {
            id: this.id.toHexString(),
            createdAt: this.createdAt.toISOString(),
            title: this.title,
            message: this.message,
            name: this. name
        };
    }
}
