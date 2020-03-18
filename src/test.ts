import { CryptoService } from './Crypto';

const cryptoService = new CryptoService();

const text = 'aaaa';

// const encrypted = cryptoService.encrypt(Buffer.from(text, 'utf-8'));
// const encryptedText = encrypted.toString('base64');
// console.log(cryptoService.decrypt(Buffer.from(encryptedText, 'base64')).toString('utf-8'));

const encrypted = cryptoService.encrypt(text);
console.log(cryptoService.decrypt(encrypted));
