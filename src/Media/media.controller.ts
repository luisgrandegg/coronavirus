import { Controller, Req, Post, Body } from '@nestjs/common';

import { MediaService } from './media.service';

export enum Routes {
    SIGN = '/media/sign'
};

@Controller()
export class MediaController {
    constructor(
        private readonly mediaService: MediaService
    ) {}

    @Post(Routes.SIGN)
    get(
        @Body() body: object
    ): Promise<{ signature: string; }> {
        return this.mediaService.sign(body).then((signature: string) => ({ signature }));
    }
}
