import { ObjectID } from 'mongodb';
import { Entity, ObjectIdColumn, Column, CreateDateColumn, UpdateDateColumn, BeforeInsert } from "typeorm";
import {  IsString, IsOptional, IsBoolean } from 'class-validator';

export interface IGratitude {
    id: string;
    title: string;
    message: string;
    name: string;
    createdAt: string;
    imagePublicId: string | null;
    imageUrl: string | null;
    active: boolean;
    flagged: boolean;
}

@Entity()
export class Gratitude {
    @ObjectIdColumn()
    id: ObjectID;

    @IsString()
    @IsOptional()
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
    setFlags(): void {
        this.active = true;
        this.flagged = false;
    }

    toJSON(): IGratitude {
        return {
            id: this.id.toHexString(),
            createdAt: this.createdAt.toISOString(),
            title: this.title,
            message: this.message,
            name: this.name,
            imagePublicId: this.imagePublicId,
            imageUrl: this.imageUrl,
            active: this.active,
            flagged: this.flagged
        };
    }
}
