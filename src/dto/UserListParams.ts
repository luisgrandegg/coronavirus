export interface IUserListParams {
    isActive?: boolean;
    isValidated?: boolean;
}

export interface IUserListParamsRequest {
    isActive?: string;
    isValidated?: string;
}

export class UserListParams {
    static createFromRequest(
        request: IUserListParamsRequest
    ): UserListParams {
        return new UserListParams(
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

    toJSON(): IUserListParams {
        const params: IUserListParams = {};
        if (this.isActive === true || this.isActive === false) {
            params.isActive = this.isActive;
        }
        if (this.isValidated === true || this.isValidated === false) {
            params.isValidated = this.isValidated;
        }
        return params;
    }
}
