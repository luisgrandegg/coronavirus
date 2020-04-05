import { DoctorType } from "../Doctor/Doctor";


export interface ICreateGratitudeDto {
    message: string;
    name: string;
    title: string;
    imagePublicId: string | null,
    imagePublicUrl: string | null
}

export class CreateGratitudeDto {
    static createFromRequest(
        request: ICreateGratitudeDto
    ): CreateGratitudeDto {
        return new CreateGratitudeDto(
            request.title,
            request.message,
            request.name,
            request.imagePublicId,
            request.imagePublicUrl
        );
    }

    constructor(
        public title: string,
        public message: string,
        public name: string,
        public imagePublicId: string | null,
        public imagePublicUrl: string | null
    ) { }
}
