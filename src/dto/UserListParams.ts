import { DoctorType } from "../Doctor";

export interface IUserListParams {
    isActive?: boolean;
    isValidated?: boolean;
    doctorType?: DoctorType;
}

export interface IUserListParamsRequest {
    isActive?: string;
    isValidated?: string;
}

export class UserListParams {
    static createFromRequest(
        request: IUserListParamsRequest,
        doctorType: DoctorType
    ): UserListParams {
        return new UserListParams(
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

    toJSON(): IUserListParams {
        const params: IUserListParams = {};
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
