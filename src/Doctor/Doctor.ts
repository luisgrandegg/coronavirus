import { ObjectID } from 'mongodb';
import { Entity, ObjectIdColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { IsString, IsOptional, IsEmail } from 'class-validator';

export interface IDoctor {
    createdAt: Date;
    name: string;
    surname: string;
    speciality: string;
    license: string;
    email: string;
    phone: string;
    updatedAt: Date;
    id: string;
    userId: string;
}

@Entity()
export class Doctor {
    @ObjectIdColumn()
    id: ObjectID;

    @Column()
    userId: ObjectID;

    @IsString()
    @Column()
    name: string;

    @IsString()
    @Column()
    surname: string;

    @IsString()
    @IsOptional()
    @Column()
    speciality: string;

    @IsString()
    @Column()
    license: string;

    @IsEmail()
    @Column()
    email: string;

    @IsString()
    @Column()
    phone: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    toJSON(): IDoctor {
        return {
            createdAt: this.createdAt,
            name: this.name,
            surname: this.surname,
            speciality: this.speciality,
            license: this.license,
            email: this.email,
            phone: this.phone,
            updatedAt: this.updatedAt,
            id: this.id.toHexString(),
            userId: this.userId.toHexString()
        };
    }
}
