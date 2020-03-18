export interface IDoctorListParams {
    isValidated?: boolean;
}

export interface IDoctorListParamsRequest {
    isValidated?: string;
}

export class DoctorListParams {
    static createFromRequest(
        request: IDoctorListParamsRequest
    ): DoctorListParams {
        return new DoctorListParams(
            request.isValidated === 'false' ? false :
                request.isValidated === 'true' ? true :
                undefined
        );
    }

    constructor(
        public isValidated?: boolean
    ) {}

    toJSON(): IDoctorListParams {
        const params: IDoctorListParams = {};
        if (this.isValidated === true || this.isValidated === false) {
            params.isValidated = this.isValidated;
        }
        return params;
    }
}
