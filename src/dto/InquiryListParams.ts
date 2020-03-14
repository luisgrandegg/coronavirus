import { ObjectID, ObjectId } from "mongodb";

export interface IInquiryListParams {
    doctorId?: ObjectId;
    speciality?: string;
    attended?: boolean;
    solved?: boolean;
}

export interface IInquiryListParamsRequest {
    doctorId?: string;
    speciality?: string;
    attended?: string;
    solved?: string;
}

export class InquiryListParams {
    static createFromRequest(
        request: IInquiryListParamsRequest
    ): InquiryListParams {
        return new InquiryListParams(
            request.doctorId ? ObjectID.createFromHexString(request.doctorId): undefined,
            request.speciality,
            request.attended === 'false' ? false :
                request.attended === 'true' ? true :
                undefined,
            request.solved === 'false' ? false :
                request.solved === 'true' ? true :
                undefined
        );
    }

    constructor(
        public doctorId?: ObjectId,
        public speciality?: string,
        public attended?: boolean,
        public solved?: boolean
    ) {}

    toJSON(): IInquiryListParams {
        const params: IInquiryListParams = {};
        if (this.doctorId) {
            params.doctorId = this.doctorId;
        }
        if (this.speciality) {
            params.speciality = this.speciality;
        }
        if (this.attended === true || this.attended === false) {
            params.attended = this.attended;
        }
        if (this.solved === true || this.solved === false) {
            params.solved = this.solved;
        }
        return params;
    }
}
