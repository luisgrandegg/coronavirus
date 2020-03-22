import { UserType } from "../User/User";
import { DoctorType } from "../Doctor/Doctor";

export interface IRegisterUserDto {
    email: string;
    confirmPassword: string;
    password: string;
    terms: boolean;
    privacy: boolean;
    userType: UserType,
    doctorType: DoctorType;
}
