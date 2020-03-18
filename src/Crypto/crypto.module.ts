import { Module } from '@nestjs/common';

import { CryptoService } from './crypto.service';

@Module({
    exports: [
        CryptoService
    ],
    imports: [
    ],
    controllers: [],
    providers: [CryptoService],
})
export class CryptoModule {}
