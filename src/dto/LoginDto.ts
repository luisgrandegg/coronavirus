export interface ILoginDto {
    email: string;
    password: string;
}

export class LoginDto {
    static createFromRequest(
        request: ILoginDto
    ): LoginDto {
        return new LoginDto(
            request.email,
            request.password
        );
    }

    constructor(
        public email: string,
        public password: string
    ) {}
}
