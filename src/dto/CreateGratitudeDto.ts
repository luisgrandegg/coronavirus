import { DoctorType } from "../Doctor/Doctor";


export interface ICreateGratitudeDto {
    message: string;
    name: string;
    title: string;
}

export class CreateGratitudeDto {
    static createFromRequest(
        request: ICreateGratitudeDto
    ): CreateGratitudeDto {
        return new CreateGratitudeDto(
            request.title,
            request.message,
            request.name
        );
    }

    constructor(
        public title: string,
        public message: string,
        public name: string
    ) { }
}
