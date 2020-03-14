export class UserExistsRequestDto {
    static createFromRequest(userExistsRequestData: any): UserExistsRequestDto {
        return new UserExistsRequestDto(
          userExistsRequestData.email,
        );
    }

    constructor(
        public email: string,
    ) {}

    isValid(): boolean {
        return !!this.email;
    }
}
