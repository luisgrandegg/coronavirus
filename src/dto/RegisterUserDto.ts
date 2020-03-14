import { UserType } from "../User";

export interface IRegisterUserDto {
    email: string;
    confirmPassword: string;
    password: string;
    terms: boolean;
    privacy: boolean;
    userType: UserType
}
