import { FeelingType } from "../Feeling";

export interface IFeelingRequestDto {
    type: string;
}

export class FeelingRequestDto {
    static createFromRequest(
        request: IFeelingRequestDto
    ): FeelingRequestDto {
        return new FeelingRequestDto(
            request.type as FeelingType
        );
    }

    constructor(
        public type: FeelingType
    ) {}
}
