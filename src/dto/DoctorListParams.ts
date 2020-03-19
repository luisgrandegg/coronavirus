export interface IDoctorListParams {
    isActive?: boolean;
    isValidated?: boolean;
}

export interface IDoctorListParamsRequest {
    isActive?: string;
    isValidated?: string;
}

export class DoctorListParams {
    static createFromRequest(
        request: IDoctorListParamsRequest
    ): DoctorListParams {
        return new DoctorListParams(
            request.isActive === 'false' ? false :
                request.isActive === 'true' ? true :
                undefined,
            request.isValidated === 'false' ? false :
                request.isValidated === 'true' ? true :
                undefined
        );
    }

    constructor(
        public isActive?: boolean,
        public isValidated?: boolean
    ) {}

    toJSON(): IDoctorListParams {
        const params: IDoctorListParams = {};
        if (this.isActive === true || this.isActive === false) {
            params.isActive = this.isActive;
        }
        if (this.isValidated === true || this.isValidated === false) {
            params.isValidated = this.isValidated;
        }
        return params;
    }
}
