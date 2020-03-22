

import { UserType } from "../User/User";
import { DoctorType } from "../Doctor/Doctor";

export interface IRegisterDoctorDto {
    name: string;
    surname: string;
    speciality: string;
    license: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
    terms: boolean;
    privacy: boolean;
    doctorType: string;
}

export class RegisterDoctorDto {
    public userType: UserType = UserType.DOCTOR;

    static createFromRequest(
        request: IRegisterDoctorDto
    ): RegisterDoctorDto {
        return new RegisterDoctorDto(
            request.name,
            request.surname,
            request.speciality,
            request.license,
            request.email,
            request.phone,
            request.password,
            request.confirmPassword,
            request.terms,
            request.privacy,
            request.doctorType as DoctorType
        );
    }

    constructor(
        public name: string,
        public surname: string,
        public speciality: string,
        public license: string,
        public email: string,
        public phone: string,
        public password: string,
        public confirmPassword: string,
        public terms: boolean,
        public privacy: boolean,
        public doctorType: DoctorType
    ) {}
}
