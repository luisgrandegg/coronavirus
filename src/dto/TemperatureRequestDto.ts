export interface ITemperatureRequestDto {
    measure: number;
}

export class TemperatureRequestDto {
    static createFromRequest(
        request: ITemperatureRequestDto
    ): TemperatureRequestDto {
        return new TemperatureRequestDto(
            request.measure
        );
    }

    constructor(
        public measure: number
    ) {}
}
