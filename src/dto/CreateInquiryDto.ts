import { DoctorType } from "../Doctor/Doctor";


export interface ICreateInquiryDto {
    age: number;
    email: string;
    speciality: string;
    summary: string;
    terms: boolean;
    time: string;
    privacy: boolean;
    confirmAge: boolean;
    doctorType: string;
}

export class CreateInquiryDto {
    static createFromRequest(
        request: ICreateInquiryDto,
        ipAddress: string
    ): CreateInquiryDto {
        return new CreateInquiryDto(
            request.age,
            request.email,
            request.speciality,
            request.summary,
            request.terms,
            request.time,
            request.privacy,
            request.confirmAge,
            request.doctorType as DoctorType,
            ipAddress
        );
    }

    constructor(
        public age: number,
        public email: string,
        public speciality: string,
        public summary: string,
        public terms: boolean,
        public time: string,
        public privacy: boolean,
        public confirmAge: boolean,
        public doctorType: DoctorType,
        public ipAddress: string
    ) { }
}
