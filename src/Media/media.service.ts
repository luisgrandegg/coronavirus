import { Injectable } from '@nestjs/common';
import * as cloudinary from 'cloudinary';

import { media } from '../config';

@Injectable()
export class MediaService {
    constructor( ) {
        cloudinary.v2.config({
            cloud_name: media.cloudName,
            api_key: media.apiKey,
            api_secret: media.apiSecret
        });
    }
    async sign(paramsToSign: object): Promise<string> {
        return cloudinary.v2.utils.api_sign_request(paramsToSign, media.apiSecret);
    }
}
