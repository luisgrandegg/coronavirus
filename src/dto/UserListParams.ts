export interface IUserListParams {
    isValidated?: boolean;
}

export interface IUserListParamsRequest {
    isValidated?: string;
}

export class UserListParams {
    static createFromRequest(
        request: IUserListParamsRequest
    ): UserListParams {
        return new UserListParams(
            request.isValidated === 'false' ? false :
                request.isValidated === 'true' ? true :
                undefined
        );
    }

    constructor(
        public isValidated?: boolean
    ) {}

    toJSON(): IUserListParams {
        const params: IUserListParams = {};
        if (this.isValidated === true || this.isValidated === false) {
            params.isValidated = this.isValidated;
        }
        return params;
    }
}
