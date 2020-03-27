import { DoctorType } from "../Doctor";

export interface IDoctorListParams {
    isActive?: boolean;
    isValidated?: boolean;
    doctorType?: DoctorType;
}

export interface IDoctorListParamsRequest {
    isActive?: string;
    isValidated?: string;
}

export class DoctorListParams {
    static createFromRequest(
        request: IDoctorListParamsRequest,
        doctorType: DoctorType
    ): DoctorListParams {
        return new DoctorListParams(
            request.isActive === 'false' ? false :
                request.isActive === 'true' ? true :
                undefined,
            request.isValidated === 'false' ? false :
                request.isValidated === 'true' ? true :
                undefined,
            doctorType
        );
    }

    constructor(
        public isActive?: boolean,
        public isValidated?: boolean,
        public doctorType?: DoctorType
    ) {}

    toJSON(): IDoctorListParams {
        const params: IDoctorListParams = {};
        if (this.isActive === true || this.isActive === false) {
            params.isActive = this.isActive;
        }
        if (this.isValidated === true || this.isValidated === false) {
            params.isValidated = this.isValidated;
        }
        if (this.doctorType) {
            params.doctorType = this.doctorType;
        }
        return params;
    }
}
