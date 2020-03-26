

export interface IDoctorCommentDto {
    comment: string;
}

export class DoctorCommentDto {
    static createFromRequest(
        request: IDoctorCommentDto
    ): DoctorCommentDto {
        return new DoctorCommentDto(
            request.comment
        );
    }

    constructor(
        public comment: string
    ) {}
}
