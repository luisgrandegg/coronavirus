import { ObjectID } from 'mongodb';
import { Entity, ObjectIdColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

export interface ITemperature {
    createdAt: Date;
    measure: number;
    updatedAt: Date;
}

@Entity()
export class Temperature {
    @ObjectIdColumn()
    id: ObjectID;

    @Column()
    userId: ObjectID;

    @Column()
    measure: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    toJSON(): ITemperature {
        return {
            createdAt: this.createdAt,
            measure: this.measure,
            updatedAt: this.updatedAt
        };
    }
}
