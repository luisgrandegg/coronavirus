import { ObjectID, ObjectId } from "mongodb";

export interface IGratitudeListParams {
    active?: boolean;
    flagged?: boolean;
}

export interface IGratitudeListParamsRequest {
    active?: string;
    flagged?: string;
}

export class GratitudeListParams {
    static createFromRequest(
        request: IGratitudeListParamsRequest
    ): GratitudeListParams {
        return new GratitudeListParams(
            request.active === 'false' ? false :
                request.active === 'true' ? true :
                    undefined,
            request.flagged === 'false' ? false :
                request.flagged === 'true' ? true :
                    undefined
        );
    }

    constructor(
        public active?: boolean,
        public flagged?: boolean
    ) {}

    toJSON(): IGratitudeListParams {
        const params: IGratitudeListParams = {};
        if (this.active === true || this.active === false) {
            params.active = this.active;
        }
        if (this.flagged === true || this.flagged === false) {
            params.flagged = this.flagged;
        }
        return params;
    }
}
