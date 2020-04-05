import { ObjectID } from 'mongodb';
import { Entity, ObjectIdColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";
import {  IsString, IsOptional } from 'class-validator';

export interface IGratitude {
    id: string;
    title: string;
    message: string;
    name: string;
    createdAt: string;
    imagePublicId: string | null;
    imageUrl: string | null;
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

    @IsOptional()
    @IsString()
    @Column()
    imagePublicId: string;

    @IsOptional()
    @IsString()
    @Column()
    imageUrl: string;

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
            name: this.name,
            imagePublicId: this.imagePublicId,
            imageUrl: this.imageUrl
        };
    }
}
