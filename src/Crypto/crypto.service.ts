import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

import { crypto as cryptoConfig } from '../config';

@Injectable()
export class CryptoService {
    private algorithm: string = 'aes-256-ctr';
    private secretKey: string = cryptoConfig.secretKey;
    private key: string;

    constructor() {
        this.key = crypto.createHash('sha256').update(this.secretKey).digest('base64').substr(0, 32);
    }

    encrypt(text: string): string {
        const buffer = Buffer.from(text, 'utf-8');
        // Create an initialization vector
        const iv = crypto.randomBytes(16);
        // Create a new cipher using the algorithm, key, and iv
        const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);
        // Create the new (encrypted) buffer
        const result = Buffer.concat([iv, cipher.update(buffer), cipher.final()]);
        return result.toString('base64');
    }

    decrypt(text: string): string {
        let buffer = Buffer.from(text, 'base64');
        // Get the iv: the first 16 bytes
        const iv = buffer.slice(0, 16);
        // Get the rest
        buffer = buffer.slice(16);
        // Create a decipher
        const decipher = crypto.createDecipheriv(this.algorithm, this.key, iv);
        // Actually decrypt it
        const result = Buffer.concat([decipher.update(buffer), decipher.final()]);
        return result.toString('utf-8');
    }
}

// import { Injectable } from '@nestjs/common';
// import * as crypto from 'crypto';

// import { crypto as cryptoConfig } from '../config';

// @Injectable()
// export class CryptoService {
//     private algorithm: string = 'aes-256-ctr';
//     private secretKey: string = cryptoConfig.secretKey;
//     private key: string;

//     constructor() {
//         this.key = crypto.createHash('sha256').update(this.secretKey).digest('base64').substr(0, 32);
//     }

//     encrypt(textToEncrypt: string): string {
//         // Create an initialization vector
//         const iv = crypto.randomBytes(16);
//         // Create a new cipher using the algorithm, key, and iv
//         const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);
//         // Create the new (encrypted) buffer
//         const result = Buffer.concat([iv, cipher.update(Buffer.from(textToEncrypt, 'utf-8')), cipher.final()]);
//         return result.toString('base64');
//     }

//     decrypt(textToDecrypt: string): string {
//         // Get the iv: the first 16 bytes
//         const iv = textToDecrypt.slice(0, 16);
//         // Get the rest
//         textToDecrypt = textToDecrypt.slice(16);
//         // Create a decipher
//         const decipher = crypto.createDecipheriv(this.algorithm, this.key, iv);
//         // Actually decrypt it
//         const result = Buffer.concat([decipher.update(Buffer.from(textToDecrypt, 'base64')), decipher.final()]);
//         return result.toString('utf-8');
//     }
// }
