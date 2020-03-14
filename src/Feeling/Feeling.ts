import { ObjectID } from 'mongodb';
import { Entity, ObjectIdColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

export enum FeelingType {
    BETTER = 'better',
    SAME = 'same',
    WORSE = 'worse'
}

export interface IFeeling {
    createdAt: Date;
    type: FeelingType;
    updatedAt: Date;
}

@Entity()
export class Feeling {
    @ObjectIdColumn()
    id: ObjectID;

    @Column()
    userId: ObjectID;

    @Column()
    type: FeelingType;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    toJSON(): IFeeling {
        return {
            createdAt: this.createdAt,
            type: this.type,
            updatedAt: this.updatedAt
        };
    }
}
