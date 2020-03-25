import { ObjectID, ObjectId } from "mongodb";
import { InquiryPagination } from "../Inquiry";
import { DoctorType } from "../Doctor";

export interface ISpecialities {
    '$in': string[];
}

export interface IInquiryListParams {
    doctorId?: ObjectId;
    speciality?: string | ISpecialities;
    specialities?: string[];
    attended?: boolean;
    solved?: boolean;
    active?: boolean;
    flagged?: boolean;
    doctorType?: DoctorType;
}

export interface IInquiryListParamsRequest {
    doctorId?: string;
    speciality?: string;
    specialities?: string[];
    attended?: string;
    solved?: string;
    active?: string;
    flagged?: string;
    page?: string;
    perPage?: string;
}

export class InquiryListParams {
    static createFromRequest(
        request: IInquiryListParamsRequest,
        doctorType: DoctorType
    ): InquiryListParams {
        return new InquiryListParams(
            request.doctorId ? ObjectID.createFromHexString(request.doctorId) : undefined,
            request.speciality,
            request.specialities,
            request.attended === 'false' ? false :
                request.attended === 'true' ? true :
                    undefined,
            request.solved === 'false' ? false :
                request.solved === 'true' ? true :
                    undefined,
            request.active === 'false' ? false :
                request.active === 'true' ? true :
                    undefined,
            request.flagged === 'false' ? false :
                request.flagged === 'true' ? true :
                    undefined,
            request.page ? parseInt(request.page) : 1,
            request.perPage ? parseInt(request.perPage) : InquiryPagination.PER_PAGE,
            doctorType
        );
    }

    constructor(
        public doctorId?: ObjectId,
        public speciality?: string,
        public specialities?: string[],
        public attended?: boolean,
        public solved?: boolean,
        public active?: boolean,
        public flagged?: boolean,
        public page?: number,
        public perPage?: number,
        public doctorType?: DoctorType
    ) {}

    toJSON(): IInquiryListParams {
        const params: IInquiryListParams = {};
        if (this.doctorId) {
            params.doctorId = this.doctorId;
        }
        if (this.speciality) {
            params.speciality = this.speciality;
        }
        if (this.specialities) {
            params.speciality = { '$in': this.specialities };
        }
        if (this.attended === true || this.attended === false) {
            params.attended = this.attended;
        }
        if (this.solved === true || this.solved === false) {
            params.solved = this.solved;
        }
        if (this.active === true || this.active === false) {
            params.active = this.active;
        }
        if (this.flagged === true || this.flagged === false) {
            params.flagged = this.flagged;
        }
        if (this.doctorType) {
            params.doctorType = this.doctorType;
        }
        return params;
    }
}
